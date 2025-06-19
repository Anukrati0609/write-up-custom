"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Timer, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  getCurrentPhase,
  getTimeRemainingInPhase,
  getTimeline,
} from "@/lib/timeline";

export default function TimelineStatus() {
  const [timeline, setTimeline] = useState(null);
  const [currentPhase, setCurrentPhase] = useState("loading");
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    async function loadTimelineData() {
      try {
        // Get the timeline data
        const timelineData = await getTimeline();
        setTimeline(timelineData);

        // Get the current phase
        const phase = await getCurrentPhase();
        setCurrentPhase(phase);

        // Get time remaining
        const remaining = await getTimeRemainingInPhase();
        setTimeRemaining(remaining);
      } catch (error) {
        console.error("Error loading timeline:", error);
      }
    }

    loadTimelineData();

    // Set up interval to update timeRemaining
    const interval = setInterval(async () => {
      const remaining = await getTimeRemainingInPhase();
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPhaseColor = () => {
    switch (currentPhase) {
      case "registration":
        return "bg-blue-500";
      case "submission":
        return "bg-green-500";
      case "voting":
        return "bg-purple-500";
      case "results":
        return "bg-amber-500";
      case "awaiting_results":
        return "bg-orange-500";
      case "inactive":
      default:
        return "bg-slate-500";
    }
  };

  const getPhaseName = () => {
    switch (currentPhase) {
      case "registration":
        return "Registration Phase";
      case "submission":
        return "Submission Phase";
      case "voting":
        return "Voting Phase";
      case "results":
        return "Results Announced";
      case "awaiting_results":
        return "Awaiting Results";
      case "inactive":
        return "Competition Inactive";
      default:
        return "Loading...";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const formatRemainingTime = () => {
    if (!timeRemaining) return "Calculating...";
    const { days, hours, minutes, seconds } = timeRemaining;

    return (
      <>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{days}</span>
            <span className="text-xs uppercase text-slate-400">days</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{hours}</span>
            <span className="text-xs uppercase text-slate-400">hours</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{minutes}</span>
            <span className="text-xs uppercase text-slate-400">mins</span>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{seconds}</span>
            <span className="text-xs uppercase text-slate-400">secs</span>
          </div>
        </div>
      </>
    );
  };

  if (!timeline) {
    return (
      <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400">Loading timeline information...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-5 w-5 text-indigo-400" />
        <h3 className="font-bold text-lg">Competition Timeline</h3>
      </div>

      <div className="mb-4">
        <Badge className={`${getPhaseColor()} mb-2`}>{getPhaseName()}</Badge>
        {timeRemaining && currentPhase !== "results" && (
          <div className="mt-2">
            <div className="flex items-center gap-1 mb-1 text-slate-300">
              <Timer className="h-4 w-4" />
              <span>Time Remaining:</span>
            </div>
            {formatRemainingTime()}
          </div>
        )}
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Registration:</span>
          <span
            className={`font-medium ${
              currentPhase === "registration"
                ? "text-blue-400"
                : "text-slate-300"
            }`}
          >
            {formatDate(timeline.registrationStart)} -
            {formatDate(timeline.registrationEnd)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Submission:</span>
          <span
            className={`font-medium ${
              currentPhase === "submission"
                ? "text-green-400"
                : "text-slate-300"
            }`}
          >
            {formatDate(timeline.submissionStart)} -
            {formatDate(timeline.submissionEnd)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Voting:</span>
          <span
            className={`font-medium ${
              currentPhase === "voting" ? "text-purple-400" : "text-slate-300"
            }`}
          >
            {formatDate(timeline.votingStart)} -{formatDate(timeline.votingEnd)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Results:</span>
          <span
            className={`font-medium ${
              currentPhase === "results" ? "text-amber-400" : "text-slate-300"
            }`}
          >
            {formatDate(timeline.resultsDate)}
          </span>
        </div>
      </div>
    </Card>
  );
}
