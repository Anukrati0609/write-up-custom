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
  const { entries, fetchAllEntries, validateAdminSession, admin } = useAdminStore();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
        const foundEntry = entries.find(e => e.id === entryId);
        
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

  const handleApprove = async () => {
    if (!entry) return;
    setUpdating(true);
    
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateEntryStatus",
          entryId: entry.id,
          status: "approved",
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setEntry({ ...entry, status: "approved" });
      }
    } catch (error) {
      console.error("Error approving entry:", error);
    } finally {
      setUpdating(false);
    }
  };
  
  const handleReject = async () => {
    if (!entry) return;
    setUpdating(true);
    
    try {
      const response = await fetch("/api/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateEntryStatus",
          entryId: entry.id,
          status: "rejected",
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setEntry({ ...entry, status: "rejected" });
      }
    } catch (error) {
      console.error("Error rejecting entry:", error);
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
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-white">Entry Details</h1>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Loading entry details...</div>
          </div>
        ) : !entry ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-white">Entry not found</div>
          </div>
        ) : (
          <Card className="p-6 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{entry.title}</h2>
                <div className="text-slate-400 mt-1">
                  By {entry.authorName} • {entry.year} • {entry.branch}
                </div>
                <div className="mt-3 space-x-2">
                  <Badge className="bg-indigo-600">Votes: {entry.votes || 0}</Badge>
                  <Badge 
                    className={`${
                      entry.status === 'approved' ? 'bg-green-500' : 
                      entry.status === 'rejected' ? 'bg-red-500' : 
                      'bg-yellow-500 text-black'
                    }`}
                  >
                    {entry.status || "Pending"}
                  </Badge>
                </div>
              </div>
              
              <div className="space-x-3">
                <Button
                  onClick={handleApprove}
                  disabled={updating || entry.status === 'approved'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating ? "Updating..." : "Approve"}
                </Button>
                
                <Button
                  onClick={handleReject}
                  disabled={updating || entry.status === 'rejected'}
                  variant="destructive"
                >
                  {updating ? "Updating..." : "Reject"}
                </Button>
              </div>
            </div>
            
            <Separator className="my-4 bg-slate-700" />
            
            <div className="mb-6">
              <SectionHeading title="Entry Details" className="mb-3" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-400">Entry ID</div>
                  <div className="font-mono text-white break-all">{entry.id}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Author ID</div>
                  <div className="font-mono text-white break-all">{entry.userId}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Created At</div>
                  <div className="text-white">
                    {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-400">Updated At</div>
                  <div className="text-white">
                    {entry.updatedAt ? new Date(entry.updatedAt).toLocaleString() : "N/A"}
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4 bg-slate-700" />
            
            <div>
              <SectionHeading title="Entry Content" className="mb-3" />
              <div 
                className="prose prose-invert max-w-none p-4 bg-slate-800 rounded-lg border border-slate-700"
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
                      Total Voters: <span className="font-bold">{entry.voters.length}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.voters.map(voterId => (
                        <Badge key={voterId} variant="outline" className="bg-slate-700">
                          {voterId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </Card>
        )}
      </div>
    </main>
  );
}
