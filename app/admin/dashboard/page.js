"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";
import TechBackground from "@/components/backgrounds/TechBackground";

export default function AdminDashboard() {
  const router = useRouter();
  const {
    admin,
    loading,
    error,
    entries,
    users,
    settings,
    fetchAllEntries,
    fetchAllUsers,
    fetchSettings,
    updateSettings,
    adminLogout,
    validateAdminSession,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState("entries");
  const [voteEnabled, setVoteEnabled] = useState(true);
  const [submissionEnabled, setSubmissionEnabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
      ]);
    };

    checkAuth();
  }, [validateAdminSession, fetchAllEntries, fetchAllUsers, fetchSettings, router]);

  useEffect(() => {
    if (settings) {
      setVoteEnabled(settings.votingEnabled ?? true);
      setSubmissionEnabled(settings.submissionEnabled ?? true);
    }
  }, [settings]);

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
    } catch (error) {
      console.error("Failed to update settings:", error);
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

  if (!admin) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative">
      {/* Tech-inspired animated background */}
      <TechBackground />

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="flex items-center justify-between mb-8 backdrop-blur-sm bg-slate-900/50 p-4 rounded-lg border border-slate-700">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Manage entries, users, and settings</p>
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
              {users.filter(user => user.is_voted).length}
            </h3>
            <p className="text-slate-400">Users Voted</p>
          </Card>
        </div>

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
                  value="settings"
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="entries" className="p-6 space-y-4">
              <SectionHeading title="All Entries" className="mb-4" />
              {loading ? (
                <p className="text-slate-400">Loading entries...</p>
              ) : entries.length === 0 ? (
                <p className="text-slate-400">No entries found</p>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-slate-800 border border-slate-700 rounded-lg"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-white">{entry.title}</h3>
                          <p className="text-slate-400">
                            By {entry.authorName} • {entry.year} • {entry.branch}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary">Votes: {entry.votes || 0}</Badge>
                            <Badge className={getStatusColor(entry.status || "pending")}>
                              {entry.status || "Pending"}
                            </Badge>
                          </div>
                        </div>                        <Button
                          onClick={() => router.push(`/admin/entry/${entry.id}`)}
                        >
                          View Details
                        </Button>
                      </div>
                      
                      <Separator className="my-3 bg-slate-700" />
                      
                      <div className="mt-2">
                        <h4 className="text-sm font-medium text-slate-300 mb-1">Content Preview:</h4>
                        <div 
                          className="text-sm text-slate-400 max-h-20 overflow-hidden relative"
                          dangerouslySetInnerHTML={{
                            __html: entry.content.substring(0, 200) + '...'
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-800 to-transparent" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="users" className="p-6">
              <SectionHeading title="All Users" className="mb-4" />
              {loading ? (
                <p className="text-slate-400">Loading users...</p>
              ) : users.length === 0 ? (
                <p className="text-slate-400">No users found</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {users.map((user) => (
                    <motion.div
                      key={user.uid}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 bg-slate-800 border border-slate-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">                        {user.photoURL && (
                          <Image
                            src={user.photoURL}
                            alt={user.displayName || "User"}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-white">{user.displayName}</h3>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant={user.is_submitted ? "success" : "outline"}>
                          {user.is_submitted ? "Submitted" : "Not Submitted"}
                        </Badge>
                        <Badge variant={user.is_voted ? "success" : "outline"}>
                          {user.is_voted ? "Voted" : "Not Voted"}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <SectionHeading title="Platform Settings" className="mb-4" />
              <div className="space-y-6">
                <Card className="p-4 bg-slate-800 border-slate-700">
                  <h3 className="text-lg font-medium text-white mb-4">Submission & Voting Controls</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Enable Entry Submissions</h4>
                        <p className="text-sm text-slate-400">Allow users to submit new entries</p>
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={submissionEnabled}
                              onChange={() => setSubmissionEnabled(!submissionEnabled)}
                            />
                            <div className={`block w-14 h-8 rounded-full ${
                              submissionEnabled ? "bg-green-500" : "bg-slate-600"
                            }`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                              submissionEnabled ? "transform translate-x-6" : ""
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">Enable Voting</h4>
                        <p className="text-sm text-slate-400">Allow users to vote on entries</p>
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
                            <div className={`block w-14 h-8 rounded-full ${
                              voteEnabled ? "bg-green-500" : "bg-slate-600"
                            }`}></div>
                            <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                              voteEnabled ? "transform translate-x-6" : ""
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <Button onClick={handleUpdateSettings} disabled={isSaving} className="mt-4">
                      {isSaving ? "Saving..." : "Save Settings"}
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </main>
  );
}
