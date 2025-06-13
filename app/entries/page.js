"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import {
  FileText,
  ThumbsUp,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(8); // Increased for better horizontal display

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
          setCurrentPage(1); // Reset pagination when fetching new entries
          setTopCurrentPage(1); // Reset top entries pagination

          // Get top 5 entries by votes (for featured display)
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
        setCurrentPage(1); // Reset to first page when refreshing entries
        setTopCurrentPage(1); // Reset top entries pagination

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
  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = entries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(entries.length / entriesPerPage); // Top entries pagination logic
  const [topCurrentPage, setTopCurrentPage] = useState(1);
  const topEntriesPerPage = 8; // Increased for better horizontal display
  const indexOfLastTopEntry = topCurrentPage * topEntriesPerPage;
  const indexOfFirstTopEntry = indexOfLastTopEntry - topEntriesPerPage;
  // Get all entries sorted by votes instead of just top 5
  const allTopEntries = [...entries].sort((a, b) => b.votes - a.votes);
  const currentTopEntries = allTopEntries.slice(
    indexOfFirstTopEntry,
    indexOfLastTopEntry
  );
  const topTotalPages = Math.ceil(allTopEntries.length / topEntriesPerPage);

  const paginateTop = (pageNumber) => {
    setTopCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextTopPage = () => {
    if (topCurrentPage < topTotalPages) {
      setTopCurrentPage(topCurrentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevTopPage = () => {
    if (topCurrentPage > 1) {
      setTopCurrentPage(topCurrentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
        <Tabs
          defaultValue="all"
          value={currentTab}
          onValueChange={(value) => {
            setCurrentTab(value);
            setCurrentPage(1); // Reset to first page when changing tabs
            setTopCurrentPage(1); // Also reset top entries pagination
          }}
          className="mt-8"
        >
          {" "}
          <TabsContent value="all">
            <motion.div
              className="pt-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentEntries.map((entry, index) => (
                  <motion.div key={entry.id} variants={fadeInUp}>
                    <div className="relative">
                      <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold z-10">
                        #{indexOfFirstEntry + index + 1}
                      </div>
                      <EntryCard
                        entry={entry}
                        user={user}
                        hasVoted={hasVoted}
                        votingFor={votingFor}
                        handleVote={handleVote}
                        className="pl-2"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>{" "}
            {entries.length > entriesPerPage && (
              <div className="mt-12 flex flex-col items-center space-y-4">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center bg-muted/20 rounded-full px-3 py-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      const isActive = pageNumber === currentPage;

                      // Show limited page numbers with ellipsis for better UX
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 &&
                          pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={pageNumber}
                            variant={isActive ? "default" : "ghost"}
                            size="sm"
                            className={`mx-1 w-10 h-10 rounded-full ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : ""
                            }`}
                            onClick={() => paginate(pageNumber)}
                            disabled={isActive}
                          >
                            {pageNumber}
                          </Button>
                        );
                      } else if (
                        (pageNumber === currentPage - 2 && currentPage > 3) ||
                        (pageNumber === currentPage + 2 &&
                          currentPage < totalPages - 2)
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="px-2 text-muted-foreground"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground bg-muted/10 px-4 py-2 rounded-full">
                  Showing {indexOfFirstEntry + 1}-
                  {Math.min(indexOfLastEntry, entries.length)} of{" "}
                  {entries.length} entries
                </div>
              </div>
            )}
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
