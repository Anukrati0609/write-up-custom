"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import TechBackground from "@/components/backgrounds/TechBackground";
import { Input } from "@/components/ui/input";
import EntryCard from "@/components/entries/EntryCard";
import TimelineManager from "@/components/admin/TimelineManager";
import {
  FileText,
  Users,
  Settings,
  Search,
  Filter,
  ArrowUpDown,
  TrendingUp,
  Award,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    admin,
    loading,
    error,
    entries,
    users,
    settings,
    timeline,
    fetchAllEntries,
    fetchAllUsers,
    fetchSettings,
    fetchTimeline,
    updateSettings,
    updateTimeline,
    adminLogout,
    validateAdminSession,
  } = useAdminStore();
  const [activeTab, setActiveTab] = useState("entries");
  const [voteEnabled, setVoteEnabled] = useState(true);
  const [submissionEnabled, setSubmissionEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [entrySortBy, setEntrySortBy] = useState("date");
  const [entrySortOrder, setEntrySortOrder] = useState("desc");
  const [showSettings, setShowSettings] = useState(false);
  const [topEntries, setTopEntries] = useState([]);
  const [entriesViewTab, setEntriesViewTab] = useState("top");

  // Pagination states
  const [currentEntriesPage, setCurrentEntriesPage] = useState(1);
  const [currentUsersPage, setCurrentUsersPage] = useState(1);
  const [entriesPerPage] = useState(6);
  const [usersPerPage] = useState(8);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateAdminSession();
      if (!isValid) {
        router.push("/admin/login");
        return;
      }

      // Fetch initial data
      await Promise.all([
        fetchAllEntries(),
        fetchAllUsers(),
        fetchSettings(),
        fetchTimeline(),
      ]);
    };

    checkAuth();
  }, [
    validateAdminSession,
    fetchAllEntries,
    fetchAllUsers,
    fetchSettings,
    fetchTimeline,
    router,
  ]);

  useEffect(() => {
    if (settings) {
      setVoteEnabled(settings.votingEnabled ?? true);
      setSubmissionEnabled(settings.submissionEnabled ?? true);
    }
  }, [settings]);

  // Calculate top entries when entries change
  useEffect(() => {
    if (entries && entries.length > 0) {
      // Get top 5 entries by votes
      const top = [...entries].sort((a, b) => b.votes - a.votes).slice(0, 5);
      setTopEntries(top);
    }
  }, [entries]);

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  const handleUpdateSettings = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        votingEnabled: voteEnabled,
        submissionEnabled: submissionEnabled,
        updatedAt: new Date(),
      });
      setShowSettings(false);
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTimeline = async (timelineData) => {
    setIsSaving(true);
    try {
      await updateTimeline(timelineData);
    } catch (error) {
      console.error("Failed to update timeline:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      case "pending":
      default:
        return "bg-yellow-500 text-black";
    }
  };

  // Filter and sort entries
  const filteredEntries = entries
    .filter((entry) => {
      if (!searchTerm.trim()) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        entry.title?.toLowerCase().includes(searchLower) ||
        entry.authorName?.toLowerCase().includes(searchLower) ||
        entry.year?.toLowerCase().includes(searchLower) ||
        entry.branch?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      // Sort logic
      switch (entrySortBy) {
        case "votes":
          return entrySortOrder === "desc"
            ? (b.votes || 0) - (a.votes || 0)
            : (a.votes || 0) - (b.votes || 0);
        case "title":
          return entrySortOrder === "desc"
            ? b.title?.localeCompare(a.title || "")
            : a.title?.localeCompare(b.title || "");
        case "status":
          return entrySortOrder === "desc"
            ? b.status?.localeCompare(a.status || "pending")
            : a.status?.localeCompare(b.status || "pending");
        case "date":
        default:
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
          return entrySortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
    });

  // Pagination logic for entries
  const indexOfLastEntry = currentEntriesPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );
  const totalEntriesPages = Math.ceil(filteredEntries.length / entriesPerPage);

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      user.displayName?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination logic for users
  const indexOfLastUser = currentUsersPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsersPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination functions
  const paginateEntries = (pageNumber) => {
    setCurrentEntriesPage(pageNumber);
  };

  const nextEntriesPage = () => {
    if (currentEntriesPage < totalEntriesPages) {
      setCurrentEntriesPage(currentEntriesPage + 1);
    }
  };

  const prevEntriesPage = () => {
    if (currentEntriesPage > 1) {
      setCurrentEntriesPage(currentEntriesPage - 1);
    }
  };

  const paginateUsers = (pageNumber) => {
    setCurrentUsersPage(pageNumber);
  };

  const nextUsersPage = () => {
    if (currentUsersPage < totalUsersPages) {
      setCurrentUsersPage(currentUsersPage + 1);
    }
  };

  const prevUsersPage = () => {
    if (currentUsersPage > 1) {
      setCurrentUsersPage(currentUsersPage - 1);
    }
  };
  // Reset pagination when search term changes or tab changes
  useEffect(() => {
    setCurrentEntriesPage(1);
    setCurrentUsersPage(1);
  }, [searchTerm, activeTab, entriesViewTab]);

  if (!admin) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative">
      {/* Tech-inspired animated background */}
      <TechBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-8 backdrop-blur-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">
              Manage entries, users, and settings
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-slate-400">Logged in as</p>
              <p className="font-medium text-white">{admin.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-5 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white">{entries.length}</h3>
            <p className="text-slate-400">Entries</p>
          </Card>
          <Card className="p-5 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white">{users.length}</h3>
            <p className="text-slate-400">Users</p>
          </Card>
          <Card className="p-5 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white">
              {entries.reduce((sum, entry) => sum + (entry.votes || 0), 0)}
            </h3>
            <p className="text-slate-400">Total Votes</p>
          </Card>
          <Card className="p-5 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white">
              {users.filter((user) => user.is_voted).length}
            </h3>
            <p className="text-slate-400">Users Voted</p>
          </Card>
        </div>

        {/* Platform settings status banner */}
        <div className="mb-8 p-4 rounded-lg backdrop-blur-sm bg-indigo-900/50 border border-indigo-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M12 2H2v10h10V2z"></path>
                  <path d="M22 12h-10v10h10V12z"></path>
                  <path d="M12 12H2v10h10V12z"></path>
                  <path d="M12 2h10v10H12V2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-white text-lg">
                  Platform Status
                </h3>
                <div className="flex gap-3 mt-1">
                  <Badge
                    className={voteEnabled ? "bg-green-500" : "bg-slate-500"}
                  >
                    Voting {voteEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                  <Badge
                    className={
                      submissionEnabled ? "bg-green-500" : "bg-slate-500"
                    }
                  >
                    Submissions {submissionEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>
            <Button onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? "Hide Settings" : "Configure Settings"}
            </Button>
          </div>

          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="mt-4 overflow-hidden"
            >
              <div className="p-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">
                          Enable Entry Submissions
                        </h4>
                        <p className="text-sm text-slate-400">
                          Allow users to submit new entries
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={submissionEnabled}
                              onChange={() =>
                                setSubmissionEnabled(!submissionEnabled)
                              }
                            />
                            <div
                              className={`block w-14 h-8 rounded-full ${
                                submissionEnabled
                                  ? "bg-green-500"
                                  : "bg-slate-600"
                              }`}
                            ></div>
                            <div
                              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                                submissionEnabled
                                  ? "transform translate-x-6"
                                  : ""
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">
                          Enable Voting
                        </h4>
                        <p className="text-sm text-slate-400">
                          Allow users to vote on entries
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={voteEnabled}
                              onChange={() => setVoteEnabled(!voteEnabled)}
                            />
                            <div
                              className={`block w-14 h-8 rounded-full ${
                                voteEnabled ? "bg-green-500" : "bg-slate-600"
                              }`}
                            ></div>
                            <div
                              className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                                voteEnabled ? "transform translate-x-6" : ""
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <Button
                      onClick={handleUpdateSettings}
                      disabled={isSaving}
                      className="mt-4"
                    >
                      {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Tabs for entries and users */}
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-6">
              <TabsList className="w-full bg-slate-800">
                <TabsTrigger
                  value="entries"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Entries Management
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="timeline"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Timeline
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="entries" className="p-6 space-y-4">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Competition Entries</h2>
                  <p className="text-muted-foreground">
                    Manage and review submissions from participants
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search entries..."
                      className="pl-9 w-full sm:w-[200px] lg:w-[300px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => {
                        setEntrySortOrder(
                          entrySortOrder === "asc" ? "desc" : "asc"
                        );
                      }}
                    >
                      <ArrowUpDown className="h-3.5 w-3.5" />
                      {entrySortOrder.toUpperCase()}
                    </Button>
                    <select
                      className="px-3 py-1.5 rounded-md border border-input bg-background text-sm cursor-pointer"
                      value={entrySortBy}
                      onChange={(e) => setEntrySortBy(e.target.value)}
                    >
                      <option value="date">Date</option>
                      <option value="votes">Votes</option>
                      <option value="title">Title</option>
                    </select>
                  </div>
                </div>
              </div>{" "}
              {/* Nested Tabs for Entries View */}
              <Tabs
                value={entriesViewTab}
                onValueChange={setEntriesViewTab}
                className="w-full"
              >
                <TabsList className="w-full max-w-md bg-slate-800 mb-6">
                  <TabsTrigger
                    value="top"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex-1"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Top Entries
                  </TabsTrigger>
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white flex-1"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    All Entries
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="top" className="space-y-4">
                  {topEntries.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-indigo-400 opacity-80" />
                      <h3 className="text-2xl font-bold mb-2 text-white">
                        No Entries Yet
                      </h3>
                      <p className="text-slate-400 mb-6 max-w-md mx-auto">
                        Waiting for participants to submit their entries!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {topEntries.map((entry, index) => (
                        <div key={entry.id} className="relative">
                          <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold z-10">
                            #{index + 1}
                          </div>
                          <EntryCard
                            entry={entry}
                            user={entry.authorName}
                            hasVoted={() => false}
                            votingFor={null}
                            handleVote={() => {}}
                            isAdmin={true}
                            showAllDetails={true}
                            className="pl-2"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all" className="space-y-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-20">
                      <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
                    </div>
                  ) : filteredEntries.length === 0 ? (
                    <div className="text-center py-10">
                      {searchTerm ? (
                        <p className="text-slate-400">
                          No entries found matching &apos;{searchTerm}&apos;
                        </p>
                      ) : (
                        <p className="text-slate-400">No entries found</p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentEntries.map((entry) => (
                          <EntryCard
                            key={entry.id}
                            entry={entry}
                            user={null}
                            hasVoted={() => false}
                            votingFor={null}
                            handleVote={() => {}}
                            isAdmin={true}
                            showAllDetails={true}
                          />
                        ))}
                      </div>

                      {/* Entries Pagination */}
                      {filteredEntries.length > entriesPerPage && (
                        <div className="mt-8 flex flex-col items-center space-y-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={prevEntriesPage}
                              disabled={currentEntriesPage === 1}
                              className="rounded-full"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center bg-muted/20 rounded-full px-3 py-1">
                              {[...Array(totalEntriesPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                const isActive =
                                  pageNumber === currentEntriesPage;

                                if (
                                  pageNumber === 1 ||
                                  pageNumber === totalEntriesPages ||
                                  (pageNumber >= currentEntriesPage - 1 &&
                                    pageNumber <= currentEntriesPage + 1)
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
                                      onClick={() =>
                                        paginateEntries(pageNumber)
                                      }
                                      disabled={isActive}
                                    >
                                      {pageNumber}
                                    </Button>
                                  );
                                } else if (
                                  (pageNumber === currentEntriesPage - 2 &&
                                    currentEntriesPage > 3) ||
                                  (pageNumber === currentEntriesPage + 2 &&
                                    currentEntriesPage < totalEntriesPages - 2)
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
                              onClick={nextEntriesPage}
                              disabled={
                                currentEntriesPage === totalEntriesPages
                              }
                              className="rounded-full"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="text-sm text-muted-foreground bg-muted/10 px-4 py-2 rounded-full">
                            Showing {indexOfFirstEntry + 1}-
                            {Math.min(indexOfLastEntry, filteredEntries.length)}{" "}
                            of {filteredEntries.length} entries
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="users" className="p-6 space-y-4">
              {/* Users tab content */}
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <p className="text-muted-foreground">
                    View and manage user accounts
                  </p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute top-3 left-3 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    className="pl-10 bg-slate-800 border-slate-700 text-white w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Users list */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentUsers.map((user) => (
                  <motion.div
                    key={user.uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-5 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover border-2 border-slate-600"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center border-2 border-slate-600">
                          <span className="text-white font-semibold text-lg">
                            {(user.displayName || user.email || "U")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-lg truncate">
                          {user.displayName || "Unknown User"}
                        </h3>
                        <p className="text-sm text-slate-400 truncate">
                          {user.email}
                        </p>
                        {user.createdAt && (
                          <p className="text-xs text-slate-500 mt-1">
                            Joined:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          className={
                            user.is_submitted
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                          }
                        >
                          {user.is_submitted
                            ? "✓ Submitted"
                            : "○ Not Submitted"}
                        </Badge>
                        <Badge
                          className={
                            user.is_voted
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                          }
                        >
                          {user.is_voted ? "✓ Voted" : "○ Not Voted"}
                        </Badge>
                      </div>

                      {/* Additional user info */}
                      <div className="pt-2 border-t border-slate-700">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-slate-500">Provider:</span>
                            <span className="text-slate-300 ml-1 capitalize">
                              {user.providerId || "Email"}
                            </span>
                          </div>
                          {user.lastLoginAt && (
                            <div>
                              <span className="text-slate-500">
                                Last Login:
                              </span>
                              <span className="text-slate-300 ml-1">
                                {new Date(
                                  user.lastLoginAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {user.uid && (
                            <div className="col-span-2">
                              <span className="text-slate-500">UID:</span>
                              <span className="text-slate-300 ml-1 font-mono text-xs">
                                {user.uid.substring(0, 8)}...
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Users Pagination */}
              {filteredUsers.length > usersPerPage && (
                <div className="mt-8 flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevUsersPage}
                      disabled={currentUsersPage === 1}
                      className="rounded-full"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center bg-muted/20 rounded-full px-3 py-1">
                      {[...Array(totalUsersPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        const isActive = pageNumber === currentUsersPage;

                        if (
                          pageNumber === 1 ||
                          pageNumber === totalUsersPages ||
                          (pageNumber >= currentUsersPage - 1 &&
                            pageNumber <= currentUsersPage + 1)
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
                              onClick={() => paginateUsers(pageNumber)}
                              disabled={isActive}
                            >
                              {pageNumber}
                            </Button>
                          );
                        } else if (
                          (pageNumber === currentUsersPage - 2 &&
                            currentUsersPage > 3) ||
                          (pageNumber === currentUsersPage + 2 &&
                            currentUsersPage < totalUsersPages - 2)
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
                      onClick={nextUsersPage}
                      disabled={currentUsersPage === totalUsersPages}
                      className="rounded-full"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground bg-muted/10 px-4 py-2 rounded-full">
                    Showing {indexOfFirstUser + 1}-
                    {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                    {filteredUsers.length} users
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="p-6">
              <div className="space-y-1 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-indigo-400" />
                      Timeline Management
                    </h2>
                    <p className="text-muted-foreground">
                      Configure competition phases and deadlines
                    </p>
                  </div>
                </div>
              </div>

              {timeline ? (
                <TimelineManager
                  timeline={timeline}
                  onSave={handleUpdateTimeline}
                  loading={loading || isSaving}
                />
              ) : (
                <div className="flex items-center justify-center p-12">
                  <p className="text-slate-400">Loading timeline data...</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}
