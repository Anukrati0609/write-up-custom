"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { Heart, ThumbsUp, Clock, FileText, ThumbsDown } from "lucide-react";
import AnimatedCard from "@/components/ui/animated-card";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import { IconButton } from "@/components/ui/icon-button";
import { Toaster, toast } from "sonner";

export default function Entries() {
  const {
    user,
    getEntries,
    voteForEntry,
    removeVote,
    hasVoted,
    loading,
    initializeAuth,
  } = useUserStore();

  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [votingFor, setVotingFor] = useState(null);

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoadingEntries(true);
      try {
        const result = await getEntries();
        if (result.success) {
          setEntries(result.entries);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoadingEntries(false);
      }
    };

    fetchEntries();
  }, [user, getEntries]);

  const refreshEntries = async () => {
    setLoadingEntries(true);
    try {
      const result = await getEntries();
      if (result.success) {
        setEntries(result.entries);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
    } finally {
      setLoadingEntries(false);
    }
  };
  const handleVote = async (entryId) => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }

    // If user has already voted for this entry, unlike it
    if (hasVoted() && user.votedFor === entryId) {
      setVotingFor(entryId);
      try {
        const result = await removeVote(entryId);
        if (result.success) {
          // Refresh entries to show updated vote count
          await refreshEntries();
          toast.success("Vote removed successfully!");
        } else {
          toast.error(result.error || "Failed to remove vote");
        }
      } catch (error) {
        console.error("Unlike error:", error);
        toast.error("Failed to remove vote. Please try again.");
      } finally {
        setVotingFor(null);
      }
      return;
    } // If user has voted for a different entry, show toast and return
    if (hasVoted() && user.votedFor !== entryId) {
      toast.error("You've already voted for another entry");
      return;
    }

    // Otherwise, cast a vote
    setVotingFor(entryId);
    try {
      const result = await voteForEntry(entryId);
      if (result.success) {
        // Refresh entries to show updated vote count
        await refreshEntries();
        toast.success("Vote cast successfully!");
      } else {
        toast.error(result.error || "Failed to cast vote");
      }
    } catch (error) {
      console.error("Voting error:", error);
      toast.error("Failed to cast vote. Please try again.");
    } finally {
      setVotingFor(null);
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (content, maxWords = 50) => {
    const words = stripHtml(content).split(" ");
    if (words.length <= maxWords) return stripHtml(content);
    return words.slice(0, maxWords).join(" ") + "...";
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (loadingEntries) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-16 w-16 bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
          <p className="text-muted-foreground">Loading entries...</p>
        </div>
      </div>
    );
  }
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      {" "}
      <Toaster />
      <SectionHeading
        title="Competition Entries"
        subtitle="Browse and vote for your favorite entries in the Matrix WriteItUp competition"
      />
      {user && hasVoted() && (
        <motion.div
          className="max-w-md mx-auto mb-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Badge variant="secondary" className="px-4 py-2">
            <ThumbsUp className="mr-2 h-4 w-4" />
            You have cast your vote!
          </Badge>
        </motion.div>
      )}
      {entries.length === 0 ? (
        <AnimatedCard
          className="p-8 text-center max-w-md mx-auto"
          whileHover={{ y: 0 }}
        >
          <FileText className="w-12 h-12 mx-auto mb-4 text-primary opacity-80" />
          <h3 className="text-2xl font-bold mb-2">No Entries Yet</h3>
          <p className="text-muted-foreground mb-6">
            Be the first to submit your entry!
          </p>
          <Link href="/register">
            <Button className="px-6">Submit Entry</Button>
          </Link>
        </AnimatedCard>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {entries.map((entry) => (
            <motion.div key={entry.id} variants={fadeInUp}>
              {" "}
              <AnimatedGradientBorder
                gradientColors="from-primary via-accent to-primary"
                animationDuration={8}
                containerClassName="h-full"
              >
                <Card className="h-full flex flex-col bg-black/10 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground line-clamp-1">
                      {entry.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="flex-grow pb-4">
                    <p className="text-muted-foreground line-clamp-4">
                      {truncateContent(entry.content, 40)}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center pt-4 border-t border-border/40">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleDateString()
                          : "Recently"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        <Heart className="h-3.5 w-3.5 text-accent fill-accent" />
                        <span>{entry.votes}</span>
                      </Badge>{" "}
                      {user &&
                        (user.votedFor === entry.id ? (
                          <IconButton
                            icon={ThumbsDown}
                            variant="secondary"
                            size="sm"
                            disabled={votingFor === entry.id}
                            onClick={() => handleVote(entry.id)}
                            className="bg-red-600/20 hover:bg-red-600/30 text-red-500"
                          >
                            {votingFor === entry.id
                              ? "Processing..."
                              : "Unvote"}
                          </IconButton>
                        ) : !hasVoted() ? (
                          <IconButton
                            icon={ThumbsUp}
                            variant="outline"
                            size="sm"
                            disabled={votingFor === entry.id}
                            onClick={() => handleVote(entry.id)}
                          >
                            {votingFor === entry.id ? "Voting..." : "Vote"}
                          </IconButton>
                        ) : null)}
                    </div>
                  </CardFooter>
                </Card>
              </AnimatedGradientBorder>
            </motion.div>
          ))}
        </motion.div>
      )}
      <div className="mt-12 text-center">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </main>
  );
}
