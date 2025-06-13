"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TimelineManager({ timeline, onSave, loading }) {
  const [formData, setFormData] = useState({
    registrationStart: "",
    registrationEnd: "",
    submissionStart: "",
    submissionEnd: "",
    votingStart: "",
    votingEnd: "",
    resultsDate: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("visual");

  // Format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy h:mm a");
  };

  // Initialize form with timeline data
  useEffect(() => {
    if (timeline) {
      setFormData({
        registrationStart: formatDateForInput(timeline.registrationStart),
        registrationEnd: formatDateForInput(timeline.registrationEnd),
        submissionStart: formatDateForInput(timeline.submissionStart),
        submissionEnd: formatDateForInput(timeline.submissionEnd),
        votingStart: formatDateForInput(timeline.votingStart),
        votingEnd: formatDateForInput(timeline.votingEnd),
        resultsDate: formatDateForInput(timeline.resultsDate),
      });
    }
  }, [timeline]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Convert form data to ISO strings
      const updatedTimeline = {
        registrationStart: new Date(formData.registrationStart).toISOString(),
        registrationEnd: new Date(formData.registrationEnd).toISOString(),
        submissionStart: new Date(formData.submissionStart).toISOString(),
        submissionEnd: new Date(formData.submissionEnd).toISOString(),
        votingStart: new Date(formData.votingStart).toISOString(),
        votingEnd: new Date(formData.votingEnd).toISOString(),
        resultsDate: new Date(formData.resultsDate).toISOString(),
      };

      await onSave(updatedTimeline);
    } catch (error) {
      console.error("Failed to save timeline:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Check current phase based on timeline dates
  const getCurrentPhase = () => {
    if (!timeline) return "Not configured";

    const now = new Date();

    if (
      new Date(timeline.registrationStart) <= now &&
      new Date(timeline.registrationEnd) >= now
    ) {
      return "Registration";
    }

    if (
      new Date(timeline.submissionStart) <= now &&
      new Date(timeline.submissionEnd) >= now
    ) {
      return "Submission";
    }

    if (
      new Date(timeline.votingStart) <= now &&
      new Date(timeline.votingEnd) >= now
    ) {
      return "Voting";
    }

    if (now > new Date(timeline.resultsDate)) {
      return "Results Published";
    }

    if (
      now > new Date(timeline.votingEnd) &&
      now <= new Date(timeline.resultsDate)
    ) {
      return "Awaiting Results";
    }

    return "Inactive";
  };

  // Get phase status color
  const getPhaseColor = (phase) => {
    switch (phase) {
      case "Registration":
        return "bg-blue-500";
      case "Submission":
        return "bg-green-500";
      case "Voting":
        return "bg-purple-500";
      case "Results Published":
        return "bg-amber-500";
      case "Awaiting Results":
        return "bg-orange-500";
      case "Inactive":
      default:
        return "bg-slate-500";
    }
  };

  // Calculate time remaining in current phase
  const getTimeRemaining = () => {
    if (!timeline) return "Not configured";

    const now = new Date();
    const phase = getCurrentPhase();

    switch (phase) {
      case "Registration":
        return formatTimeRemaining(new Date(timeline.registrationEnd) - now);
      case "Submission":
        return formatTimeRemaining(new Date(timeline.submissionEnd) - now);
      case "Voting":
        return formatTimeRemaining(new Date(timeline.votingEnd) - now);
      case "Awaiting Results":
        return formatTimeRemaining(new Date(timeline.resultsDate) - now);
      default:
        return "No active countdown";
    }
  };

  // Format time difference as days, hours, minutes
  const formatTimeRemaining = (timeDiff) => {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    return `${days}d ${hours}h ${minutes}m remaining`;
  };

  const currentPhase = getCurrentPhase();
  const phaseColor = getPhaseColor(currentPhase);
  const timeRemaining = getTimeRemaining();

  return (
    <div className="space-y-6">
      {/* Current status card */}
      <Card className="p-5 bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">
            Current Timeline Status
          </h3>
          <Badge className={phaseColor}>{currentPhase} Phase</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-slate-400" />
              <h4 className="text-slate-300">Time Remaining</h4>
            </div>
            <p className="text-white text-lg font-medium">{timeRemaining}</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-slate-400" />
              <h4 className="text-slate-300">Next Phase</h4>
            </div>
            <p className="text-white text-lg font-medium">
              {currentPhase === "Registration" &&
                `Submission starts ${formatDateForDisplay(
                  timeline?.submissionStart
                )}`}
              {currentPhase === "Submission" &&
                `Voting starts ${formatDateForDisplay(timeline?.votingStart)}`}
              {currentPhase === "Voting" &&
                `Results on ${formatDateForDisplay(timeline?.resultsDate)}`}
              {currentPhase === "Awaiting Results" &&
                `Results on ${formatDateForDisplay(timeline?.resultsDate)}`}
              {(currentPhase === "Results Published" ||
                currentPhase === "Inactive") &&
                "Competition completed"}
            </p>
          </div>
        </div>
      </Card>

      <Tabs
        defaultValue="visual"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
          <TabsTrigger value="visual">Visual Timeline</TabsTrigger>
          <TabsTrigger value="edit">Edit Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="mt-6">
          <div className="relative pb-12">
            {/* Timeline visualization */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-700"></div>

            {/* Registration Phase */}
            <div className="relative mb-12">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-1 w-6 h-6 rounded-full border-4 border-blue-500 bg-slate-900"></div>
              <div className="ml-auto mr-auto w-1/2 pr-8 text-right">
                <h3 className="text-lg font-bold text-blue-400">
                  Registration Phase
                </h3>
                <p className="text-slate-400 text-sm">
                  {formatDateForDisplay(timeline?.registrationStart)} -{" "}
                  {formatDateForDisplay(timeline?.registrationEnd)}
                </p>
              </div>
            </div>

            {/* Submission Phase */}
            <div className="relative mb-12">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-1 w-6 h-6 rounded-full border-4 border-green-500 bg-slate-900"></div>
              <div className="ml-auto mr-auto w-1/2 pl-8">
                <h3 className="text-lg font-bold text-green-400">
                  Submission Phase
                </h3>
                <p className="text-slate-400 text-sm">
                  {formatDateForDisplay(timeline?.submissionStart)} -{" "}
                  {formatDateForDisplay(timeline?.submissionEnd)}
                </p>
              </div>
            </div>

            {/* Voting Phase */}
            <div className="relative mb-12">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-1 w-6 h-6 rounded-full border-4 border-purple-500 bg-slate-900"></div>
              <div className="ml-auto mr-auto w-1/2 pr-8 text-right">
                <h3 className="text-lg font-bold text-purple-400">
                  Voting Phase
                </h3>
                <p className="text-slate-400 text-sm">
                  {formatDateForDisplay(timeline?.votingStart)} -{" "}
                  {formatDateForDisplay(timeline?.votingEnd)}
                </p>
              </div>
            </div>

            {/* Results Phase */}
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 -mt-1 w-6 h-6 rounded-full border-4 border-amber-500 bg-slate-900"></div>
              <div className="ml-auto mr-auto w-1/2 pl-8">
                <h3 className="text-lg font-bold text-amber-400">
                  Results Announcement
                </h3>
                <p className="text-slate-400 text-sm">
                  {formatDateForDisplay(timeline?.resultsDate)}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">
                  Registration Phase
                </h3>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    Start Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="registrationStart"
                    value={formData.registrationStart}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    End Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="registrationEnd"
                    value={formData.registrationEnd}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">
                  Submission Phase
                </h3>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    Start Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="submissionStart"
                    value={formData.submissionStart}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    End Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="submissionEnd"
                    value={formData.submissionEnd}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">
                  Voting Phase
                </h3>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    Start Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="votingStart"
                    value={formData.votingStart}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    End Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="votingEnd"
                    value={formData.votingEnd}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-slate-700 pb-2">
                  Results Phase
                </h3>

                <div>
                  <label className="text-sm text-slate-400 block mb-1">
                    Announcement Date
                  </label>
                  <Input
                    type="datetime-local"
                    name="resultsDate"
                    value={formData.resultsDate}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSaving || loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "Saving..." : "Save Timeline"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
