"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUserStore } from "@/store/useUserStore";
import Link from "next/link";
import {
  FaHeart,
  FaUser,
  FaCalendar,
  FaGraduationCap,
  FaVoteYea,
} from "react-icons/fa";
import { MdHome } from "react-icons/md";

export default function Entries() {
  const { user, getEntries, voteForEntry, hasVoted, loading, initializeAuth } =
    useUserStore();

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
      alert("Please sign in to vote");
      return;
    }

    if (hasVoted()) {
      alert("You have already voted");
      return;
    }

    setVotingFor(entryId);
    try {
      const result = await voteForEntry(entryId);
      if (result.success) {
        // Refresh entries to show updated vote count
        await refreshEntries();
        alert("Vote cast successfully!");
      } else {
        alert(result.error || "Failed to cast vote");
      }
    } catch (error) {
      console.error("Voting error:", error);
      alert("Failed to cast vote. Please try again.");
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

  if (loadingEntries) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading entries...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-500 mb-6">
            Competition Entries
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Browse and vote for your favorite entries in the Matrix WriteItUp
            competition
          </p>

          {user && (
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-slate-400">
              <span>Welcome, {user.displayName}</span>
              {hasVoted() && (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
                  ✓ Voted
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Entries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-900/60 backdrop-blur-lg rounded-xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all hover:transform hover:scale-105"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                    {entry.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <div className="flex items-center gap-1">
                      <FaUser className="w-3 h-3" />
                      <span>{entry.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaGraduationCap className="w-3 h-3" />
                      <span>
                        {entry.year} - {entry.branch}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-red-500">
                  <FaHeart className="w-4 h-4" />
                  <span className="font-semibold">{entry.votes}</span>
                </div>
              </div>

              {/* Content Preview */}
              <div className="mb-4">
                <p className="text-slate-300 text-sm line-clamp-4">
                  {truncateContent(entry.content)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-500">
                  {entry.createdAt
                    ? new Date(entry.createdAt).toLocaleDateString()
                    : "Recently"}
                </div>

                {user && !hasVoted() && (
                  <motion.button
                    onClick={() => handleVote(entry.id)}
                    disabled={votingFor === entry.id}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: votingFor === entry.id ? 1 : 1.05 }}
                    whileTap={{ scale: votingFor === entry.id ? 1 : 0.95 }}
                  >
                    <FaVoteYea className="w-4 h-4" />
                    <span>{votingFor === entry.id ? "Voting..." : "Vote"}</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {entries.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No Entries Yet
            </h3>
            <p className="text-slate-400 mb-6">
              Be the first to submit your entry!
            </p>
            <Link href="/register">
              <motion.button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Submit Entry
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-slate-800/60 hover:bg-slate-700/60 text-white font-medium rounded-lg transition-all border border-slate-700/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MdHome className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
