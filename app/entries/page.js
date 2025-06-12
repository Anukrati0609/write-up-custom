"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import { FileText, ThumbsUp, TrendingUp, Award } from "lucide-react";
import AnimatedCard from "@/components/ui/animated-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import EntryCard from "@/components/entries/EntryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [topEntries, setTopEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [votingFor, setVotingFor] = useState(null);
  const [currentTab, setCurrentTab] = useState("all");

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

          // Get top 5 entries by votes
          const top = [...result.entries]
            .sort((a, b) => b.votes - a.votes)
            .slice(0, 5);
          setTopEntries(top);
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

        // Refresh top entries
        const top = [...result.entries]
          .sort((a, b) => b.votes - a.votes)
          .slice(0, 5);
        setTopEntries(top);
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
    }
    // If user has voted for a different entry, show toast and return
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
        <Tabs
          defaultValue="all"
          value={currentTab}
          onValueChange={setCurrentTab}
          className="mt-8"
        >
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                All Entries
              </TabsTrigger>
              <TabsTrigger value="top" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Top 5 Entries
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all">
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {entries.map((entry) => (
                <motion.div key={entry.id} variants={fadeInUp}>
                  <EntryCard
                    entry={entry}
                    user={user}
                    hasVoted={hasVoted}
                    votingFor={votingFor}
                    handleVote={handleVote}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="top">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-semibold">
                  Top 5 Entries by Votes
                </h3>
              </div>
              <p className="text-muted-foreground">
                These are the highest-voted entries in the competition so far
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 gap-6 max-w-4xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {topEntries.map((entry, index) => (
                <motion.div key={entry.id} variants={fadeInUp}>
                  <div className="relative">
                    <div className="absolute -left-4 -top-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold z-10">
                      #{index + 1}
                    </div>
                    <EntryCard
                      entry={{ ...entry, featured: index === 0 }}
                      user={user}
                      hasVoted={hasVoted}
                      votingFor={votingFor}
                      handleVote={handleVote}
                      className="pl-5"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      )}

      <div className="mt-12 text-center">
        <Link href="/">
          <Button variant="outline">Back to Home</Button>
        </Link>
      </div>
    </main>
  );
}
