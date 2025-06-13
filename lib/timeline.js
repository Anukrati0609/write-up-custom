import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";

// Default timeline dates
const DEFAULT_TIMELINE = {
  registrationStart: new Date().toISOString(),
  registrationEnd: new Date(
    Date.now() + 14 * 24 * 60 * 60 * 1000
  ).toISOString(), // 2 weeks from now
  submissionStart: new Date().toISOString(),
  submissionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  votingStart: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString(), // 31 days from now
  votingEnd: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
  resultsDate: new Date(Date.now() + 46 * 24 * 60 * 60 * 1000).toISOString(), // 46 days from now
  updatedAt: new Date().toISOString(),
};

// Get timeline from database
export async function getTimeline() {
  try {
    const timelineRef = doc(db, "settings", "timeline");
    const timelineDoc = await getDoc(timelineRef);

    if (!timelineDoc.exists()) {
      return DEFAULT_TIMELINE;
    }

    return timelineDoc.data();
  } catch (error) {
    console.error("Error getting timeline:", error);
    return DEFAULT_TIMELINE;
  }
}

// Check if we're currently in the registration phase
export async function isRegistrationPhase() {
  const timeline = await getTimeline();
  const now = new Date();
  return (
    new Date(timeline.registrationStart) <= now &&
    new Date(timeline.registrationEnd) >= now
  );
}

// Check if we're currently in the submission phase
export async function isSubmissionPhase() {
  const timeline = await getTimeline();
  const now = new Date();
  return (
    new Date(timeline.submissionStart) <= now &&
    new Date(timeline.submissionEnd) >= now
  );
}

// Check if we're currently in the voting phase
export async function isVotingPhase() {
  const timeline = await getTimeline();
  const now = new Date();
  return (
    new Date(timeline.votingStart) <= now && new Date(timeline.votingEnd) >= now
  );
}

// Check if results have been announced
export async function isResultsPhase() {
  const timeline = await getTimeline();
  const now = new Date();
  return now >= new Date(timeline.resultsDate);
}

// Get the current phase
export async function getCurrentPhase() {
  const timeline = await getTimeline();
  const now = new Date();

  if (
    new Date(timeline.registrationStart) <= now &&
    new Date(timeline.registrationEnd) >= now
  ) {
    return "registration";
  }

  if (
    new Date(timeline.submissionStart) <= now &&
    new Date(timeline.submissionEnd) >= now
  ) {
    return "submission";
  }

  if (
    new Date(timeline.votingStart) <= now &&
    new Date(timeline.votingEnd) >= now
  ) {
    return "voting";
  }

  if (now >= new Date(timeline.resultsDate)) {
    return "results";
  }

  if (
    now > new Date(timeline.votingEnd) &&
    now < new Date(timeline.resultsDate)
  ) {
    return "awaiting_results";
  }

  return "inactive";
}

// Get time remaining in the current phase
export async function getTimeRemainingInPhase() {
  const timeline = await getTimeline();
  const now = new Date();
  const phase = await getCurrentPhase();

  let endDate;

  switch (phase) {
    case "registration":
      endDate = new Date(timeline.registrationEnd);
      break;
    case "submission":
      endDate = new Date(timeline.submissionEnd);
      break;
    case "voting":
      endDate = new Date(timeline.votingEnd);
      break;
    case "awaiting_results":
      endDate = new Date(timeline.resultsDate);
      break;
    default:
      return null;
  }

  const timeDiff = endDate - now;

  if (timeDiff <= 0) return null;

  // Calculate days, hours, minutes, seconds
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, total: timeDiff };
}

// Format time for display
export function formatTimeRemaining(timeObj) {
  if (!timeObj) return "No active countdown";

  return `${timeObj.days}d ${timeObj.hours}h ${timeObj.minutes}m ${timeObj.seconds}s`;
}

// Get formatted timeline for display
export async function getFormattedTimeline() {
  const timeline = await getTimeline();
  const currentPhase = await getCurrentPhase();
  const timeRemaining = await getTimeRemainingInPhase();

  return {
    timeline,
    currentPhase,
    timeRemaining,
    formattedTimeRemaining: formatTimeRemaining(timeRemaining),
  };
}
