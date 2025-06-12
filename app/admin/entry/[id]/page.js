"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAdminStore } from "@/store/useAdminStore";
import TechBackground from "@/components/backgrounds/TechBackground";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { Separator } from "@/components/ui/separator";

export default function EntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { entries, fetchAllEntries, validateAdminSession, admin } =
    useAdminStore();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await validateAdminSession();
      if (!isValid) {
        router.push("/admin/login");
        return;
      }

      // Load entry data inside the effect
      setLoading(true);
      try {
        // Check if entries exist in store, otherwise fetch
        if (!entries || entries.length === 0) {
          await fetchAllEntries();
        }

        // Find the entry with matching ID from the params
        const entryId = params.id;
        const foundEntry = entries.find((e) => e.id === entryId);

        if (foundEntry) {
          setEntry(foundEntry);
        } else {
          // If not found in the store, fetch it directly
          const response = await fetch(`/api/admin?action=entry&id=${entryId}`);
          const data = await response.json();

          if (data.success && data.entry) {
            setEntry(data.entry);
          } else {
            console.error("Entry not found");
            // Handle not found scenario
          }
        }
      } catch (error) {
        console.error("Error loading entry:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [validateAdminSession, router, entries, params.id, fetchAllEntries]);

  const handleUpdateStatus = async (status) => {
    if (!entry) return;
    setUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateEntryStatus",
          entryId: entry.id,
          status,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEntry({ ...entry, status });
        setUpdateMessage({
          type: "success",
          text: `Entry status updated to ${status}`,
        });
      } else {
        throw new Error(data.error || "Failed to update status");
      }
    } catch (error) {
      console.error(`Error updating entry status to ${status}:`, error);
      setUpdateMessage({
        type: "error",
        text: error.message || `Failed to update status to ${status}`,
      });
    } finally {
      setUpdating(false);
      // Auto hide message after 3 seconds
      setTimeout(() => {
        setUpdateMessage(null);
      }, 3000);
    }
  };

  const handleDeleteEntry = async () => {
    if (!entry || !deleteConfirm) return;
    setUpdating(true);
    setUpdateMessage(null);

    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "deleteEntry",
          entryIdToDelete: entry.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setUpdateMessage({
          type: "success",
          text: "Entry deleted successfully",
        });

        // Navigate back to dashboard after short delay
        setTimeout(() => {
          router.push("/admin/dashboard");
        }, 1500);
      } else {
        throw new Error(data.error || "Failed to delete entry");
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      setUpdateMessage({
        type: "error",
        text: error.message || "Failed to delete entry",
      });
      setDeleteConfirm(false);
    } finally {
      setUpdating(false);
    }
  };

  if (!admin) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 relative">
      {/* Tech-inspired animated background */}
      <TechBackground />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/dashboard")}
            className="bg-slate-800"
          >
            ← Back to Dashboard
          </Button>

          <h1 className="text-3xl font-bold text-white">Entry Details</h1>
        </div>

        {updateMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              updateMessage.type === "success"
                ? "bg-green-900/60 border border-green-600"
                : "bg-red-900/60 border border-red-600"
            }`}
          >
            <p className="text-white">{updateMessage.text}</p>
          </motion.div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800">
            <div className="text-white flex flex-col items-center">
              <div className="w-10 h-10 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin mb-4"></div>
              Loading entry details...
            </div>
          </div>
        ) : !entry ? (
          <div className="flex items-center justify-center h-64 bg-slate-900/50 backdrop-blur-sm rounded-lg border border-slate-800">
            <div className="text-white text-center">
              <h2 className="text-xl font-bold mb-2">Entry not found</h2>
              <p className="text-slate-400">
                The requested entry could not be found.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/dashboard")}
                className="mt-4"
              >
                Return to Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <Card className="p-6 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{entry.title}</h2>
                <div className="text-slate-400 mt-1">
                  By {entry.authorName || "Unknown"} • {entry.year || "N/A"} •{" "}
                  {entry.branch || "N/A"}
                </div>
                <div className="mt-3 space-x-2">
                  <Badge className="bg-indigo-600">
                    Votes: {entry.votes || 0}
                  </Badge>
                  <Badge
                    className={`${
                      entry.status === "approved"
                        ? "bg-green-500"
                        : entry.status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500 text-black"
                    }`}
                  >
                    {entry.status || "Pending"}
                  </Badge>
                </div>
              </div>

              <div className="space-x-3">
                <Button
                  onClick={() => handleUpdateStatus("approved")}
                  disabled={updating || entry.status === "approved"}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating && entry.status !== "approved"
                    ? "Updating..."
                    : "Approve"}
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("rejected")}
                  disabled={updating || entry.status === "rejected"}
                  variant="destructive"
                >
                  {updating && entry.status !== "rejected"
                    ? "Updating..."
                    : "Reject"}
                </Button>

                <Button
                  onClick={() => handleUpdateStatus("pending")}
                  disabled={
                    updating || entry.status === "pending" || !entry.status
                  }
                  variant="outline"
                >
                  {updating && (entry.status === "pending" || !entry.status)
                    ? "Updating..."
                    : "Mark Pending"}
                </Button>
              </div>
            </div>

            <Separator className="my-4 bg-slate-700" />

            <div className="mb-6">
              <SectionHeading title="Entry Details" className="mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-400">Entry ID</div>
                  <div className="font-mono text-white break-all">
                    {entry.id}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Author ID</div>
                  <div className="font-mono text-white break-all">
                    {entry.userId}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Created At</div>
                  <div className="text-white">
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Updated At</div>
                  <div className="text-white">
                    {entry.updatedAt
                      ? new Date(entry.updatedAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>

                {entry.reviewedAt && (
                  <div>
                    <div className="text-sm text-slate-400">Reviewed At</div>
                    <div className="text-white">
                      {new Date(entry.reviewedAt).toLocaleString()}
                    </div>
                  </div>
                )}

                {entry.reviewedBy && (
                  <div>
                    <div className="text-sm text-slate-400">Reviewed By</div>
                    <div className="text-white">{entry.reviewedBy}</div>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-4 bg-slate-700" />

            <div>
              <SectionHeading title="Entry Content" className="mb-3" />
              <div
                className="prose prose-invert max-w-none p-4 bg-slate-800 rounded-lg border border-slate-700 overflow-auto"
                dangerouslySetInnerHTML={{ __html: entry.content }}
              />
            </div>

            {entry.voters && entry.voters.length > 0 && (
              <>
                <Separator className="my-4 bg-slate-700" />

                <div>
                  <SectionHeading title="Voters" className="mb-3" />
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-white">
                      Total Voters:{" "}
                      <span className="font-bold">{entry.voters.length}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.voters.map((voterId) => (
                        <Badge
                          key={voterId}
                          variant="outline"
                          className="bg-slate-700"
                        >
                          {voterId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator className="my-4 bg-slate-700" />

            <div>
              <SectionHeading
                title="Danger Zone"
                className="mb-3 text-red-500"
              />
              <div className="bg-red-950/30 p-4 rounded-lg border border-red-900/50">
                <p className="text-slate-300 mb-4">
                  Deleting an entry permanently removes it from the system. This
                  action cannot be undone.
                </p>

                {!deleteConfirm ? (
                  <Button
                    variant="destructive"
                    onClick={() => setDeleteConfirm(true)}
                  >
                    Delete Entry
                  </Button>
                ) : (
                  <div className="flex items-center gap-3">
                    <Button
                      variant="destructive"
                      onClick={handleDeleteEntry}
                      disabled={updating}
                    >
                      {updating ? "Deleting..." : "Confirm Delete"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteConfirm(false)}
                      disabled={updating}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}
