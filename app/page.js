"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Calendar,
  GraduationCap,
  Heart,
  Globe,
  Award,
  Sparkles,
  Users,
  TrendingUp,
  Zap,
  Terminal,
  Code,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  LightbulbIcon,
  BrainCircuit,
  PenTool,
  DollarSign,
  Lightbulb,
  Cpu,
  Layers,
  ChevronDown,
  Rocket,
  Check,
  Flame,
  Timer,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Custom Components
import TechBackground from "@/components/backgrounds/TechBackground";
import MatrixRainBackground from "@/components/backgrounds/MatrixRainBackground";
import CircuitLinesBackground from "@/components/backgrounds/CircuitLinesBackground";
import AnimatedCard from "@/components/ui/animated-card";
import GlowingButton from "@/components/ui/glowing-button";
import HoverSpotlight from "@/components/ui/hover-spotlight";
import GlassMorphism from "@/components/ui/glass-morphism";
import FloatingElement from "@/components/ui/floating-element";
import { SectionHeading } from "@/components/ui/section-heading";
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border";
import EntryCard from "@/components/entries/EntryCard";
import { Toaster, toast } from "sonner";
import ThreeDCard from "@/components/ui/3d-card";
import TerminalDisplay from "@/components/ui/terminal-display";
import TechButton from "@/components/ui/tech-button";
import StatCounter from "@/components/ui/stat-counter";

// Store
import { useUserStore } from "@/store/useUserStore";

// Timeline utilities
import {
  getTimeline,
  getCurrentPhase,
  getTimeRemainingInPhase,
  formatTimeRemaining,
} from "@/lib/timeline";

export default function Home() {
  const {
    user,
    getEntries,
    voteForEntry,
    removeVote,
    hasVoted,
    initializeAuth,
  } = useUserStore();
  const [entries, setEntries] = useState([]);
  const [topEntries, setTopEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [votingFor, setVotingFor] = useState(null);
  const [activeTab, setActiveTab] = useState("top");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5);
  const [allTopEntries, setAllTopEntries] = useState([]);

  // Show only top 5 entries without pagination
  const currentTopEntries = allTopEntries.slice(0, 5);
  const totalPages = Math.ceil(allTopEntries.length / entriesPerPage);

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

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return unsubscribe;
  }, [initializeAuth]);

  useEffect(() => {
    // Animation for stats counters
    const timer = setTimeout(() => {
      setStatsVisible(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchEntries() {
      setLoadingEntries(true);
      try {
        const result = await getEntries();
        if (result.success) {
          // Filter out user's own entry
          const filteredEntries = user
            ? result.entries.filter((entry) => entry.userId !== user.uid)
            : result.entries;

          // Sort by votes (highest first)
          const sortedEntries = [...filteredEntries].sort(
            (a, b) => b.votes - a.votes
          );

          // Set top 5 entries
          setTopEntries(sortedEntries.slice(0, 5));

          // Set all entries for later use
          setEntries(sortedEntries);
          setAllTopEntries(sortedEntries);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoadingEntries(false);
      }
    }

    fetchEntries();
  }, [getEntries, user]);
  const refreshEntries = async () => {
    try {
      const result = await getEntries();
      if (result.success) {
        // Reset pagination
        setCurrentPage(1);

        // Filter out user's own entry
        const filteredEntries = user
          ? result.entries.filter((entry) => entry.userId !== user.uid)
          : result.entries;

        // Sort by votes (highest first)
        const sortedEntries = [...filteredEntries].sort(
          (a, b) => b.votes - a.votes
        );

        // Set top 5 entries (for featured display)
        setTopEntries(sortedEntries.slice(0, 5));

        // Set all entries
        setEntries(sortedEntries);
        setAllTopEntries(sortedEntries);
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
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

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const truncateContent = (content, maxWords = 30) => {
    const words = stripHtml(content).split(" ");
    if (words.length <= maxWords) return stripHtml(content);
    return words.slice(0, maxWords).join(" ") + "...";
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

  const counterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
      },
    },
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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const popIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  // Statistics data
  const getDaysLeft = () => {
    const today = new Date();
    const eventDate = new Date("2025-07-15T23:59:59"); // set your actual deadline
    const timeDiff = eventDate - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

  const stats = [
    {
      icon: <FileText className="h-7 w-7 text-blue-400" />,
      value: "100",
      label: "Submissions",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      icon: <Users className="h-7 w-7 text-purple-400" />,
      value: "100",
      label: "Participants",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      icon: <Award className="h-7 w-7 text-emerald-400" />,
      value: "1",
      label: "Winner",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
    },
    {
      icon: <Star className="h-7 w-7 text-amber-400" />,
      value: getDaysLeft().toString(),
      label: "Days Left",
      bgColor: "bg-amber-500/20",
      borderColor: "border-amber-500/30",
    },
  ];

  // Key Features data
  const keyFeatures = [
    {
      icon: <Sparkles className="h-6 w-6 text-blue-500" />,
      title: "Showcase Your Talent",
      description:
        "Display your writing skills to the audience and gain recognition amongst your team and peers!",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      title: "A chance to  be featured",
      description:
        "Top 3 entries will be featured on the official Matrix handl",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <Globe className="h-6 w-6 text-green-500" />,
      title: "Enhancing communication skills",
      description:
        "Connect with like-minded individuals and enhance your communication and vocab.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500" />,
      title: "A surprise reward",
      description: "Winner would receive a surprise reward from Matrix team!",
      color: "from-amber-500 to-orange-500",
    },
  ];
  // Timeline data
  const timelineEvents = [
    {
      date: "June 20th, 2025",
      title: "Event commences",
      description:
        "Registration portal opens for all participants. Show us your creativity now!",
      icon: <FileText className="h-5 w-5 text-blue-400" />,
      status: "completed",
      color: "blue",
    },
    {
      date: "June 20th onwards",
      title: "Event Ongoing",
      description:
        "Participants can submit their entries anytime before the deadline.",
      icon: <Clock className="h-5 w-5 text-amber-400" />,
      status: "active",
      color: "amber",
      highlight: true,
    },
    {
      date: "July 15, 2025",
      title: "Event Ends",
      description:
        "Final day to unleash your creativity and get a chance to win an exciting reward.",
      icon: <Rocket className="h-5 w-5 text-green-400" />,
      status: "upcoming",
      color: "green",
    },
    // {
    //   date: "June 30, 2025",
    //   title: "Competition Ends",
    //   description:
    //     "Final submission deadline. All entries must be submitted by 11:59 PM.",
    //  icon: <Check className="h-5 w-5 text-purple-400" />,
    //  status: "upcoming",
    //  color: "purple",
    // },
    {
      date: "July 17, 2025",
      title: "Results Announcement",
      description: "Winners and honorable mentions will be announced.",
      icon: <Award className="h-5 w-5 text-emerald-400" />,
      status: "upcoming",
      color: "emerald",
    },
  ];

  return (
    <main className="flex flex-col">
      <Toaster position="top-center" />
      {/* Hero Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Enhanced multi-layered background effects */}
        <div className="absolute inset-0 -z-50">
          <MatrixRainBackground opacity={0.15} speed={0.8} fontSize={14} />
        </div>
        <div className="absolute inset-0 -z-40">
          <TechBackground particleCount={180} />
        </div>
        <div className="absolute inset-0 -z-30 opacity-20">
          <CircuitLinesBackground />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90 -z-20" />
        <div className="absolute inset-0 bg-dot-pattern opacity-30 -z-20" />
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <div className="absolute top-1/4 right-1/4 w-[60rem] h-[60rem] rounded-full bg-gradient-to-br from-blue-600/10 to-purple-600/10 blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 left-1/4 w-[50rem] h-[50rem] rounded-full bg-gradient-to-tr from-purple-600/10 to-blue-500/10 blur-[120px] animate-pulse-slow" />
        </motion.div>
        <div className="container mx-auto px-4 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-16 z-10">
          {/* Left content */}
          <motion.div
            className="flex-1 max-w-2xl space-y-10"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Badge className="mb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-white/10 px-5 py-2.5 rounded-full flex items-center gap-2.5 w-fit shadow-lg shadow-primary/10 backdrop-blur-lg">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="relative"
                >
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-full blur-md"></div>
                  <Calendar className="h-5 w-5 text-blue-400 relative z-10" />
                </motion.div>
                <span>Registration Open Until June 14, 2025</span>
              </Badge>
            </motion.div>

            <motion.div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center gap-3 mb-2"
              >
                <div className="h-6 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-600"></div>
                <span className="text-lg tracking-wider uppercase text-blue-400 font-medium">
                  A Premier Writing Competition
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                <span className="relative inline-block">
                  Matrix
                  <div className="absolute -top-2 -right-2 w-6 h-6">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 0.9, 1],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-purple-400" />
                    </motion.div>
                  </div>
                </span>
                <AnimatedGradientBorder
                  borderRadius="rounded-lg"
                  gradientColors="from-blue-600 via-purple-600 to-blue-600"
                  containerClassName="inline-flex"
                  borderWidth="3px"
                  animationDuration={4}
                >
                  <motion.span
                    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-300% animate-gradient-fast px-3 py-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  >
                    Whisper Escape
                  </motion.span>
                </AnimatedGradientBorder>
              </h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600/40 to-purple-600/40 rounded-full"></div>
                <p className="text-xl text-white/70 leading-relaxed pl-4">
                  Unleash your creative potential in the ultimate content
                  writing competition organized by Matrix JEC - the skill
                  enhancement community of Jabalpur Engineering College.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-4 pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <TechButton
                size="lg"
                rightIcon={<ArrowRight className="h-5 w-5" />}
                glowing={true}
                className="w-full sm:w-auto"
              >
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center"
                >
                  Register Now
                </Link>
              </TechButton>

              <TechButton
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link
                  href="/guidelines"
                  className="w-full flex items-center justify-center"
                >
                  View Guidelines
                </Link>
              </TechButton>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate={statsVisible ? "visible" : "hidden"}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={counterVariants}
                  className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-4 flex flex-col items-center justify-center text-center`}
                >
                  <div className="mb-2">{stat.icon}</div>
                  <StatCounter
                    value={stat.value}
                    textSize="text-2xl md:text-3xl"
                    color="text-white"
                    className="font-bold"
                    animateToValue={statsVisible}
                  />
                  <div className="text-xs md:text-sm text-gray-300 mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right content - 3D Card with Terminal Display */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <FloatingElement distance={15} duration={3}>
              <ThreeDCard
                className="w-full max-w-xl mx-auto overflow-hidden"
                glareEnabled={true}
                glareColor="rgba(120, 119, 198, 0.2)"
                borderColor="rgba(139, 92, 246, 0.3)"
              >
                <GlassMorphism className="p-5 backdrop-blur-xl rounded-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-purple-400" />
                      <span>Competition Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <TerminalDisplay
                      text="Welcome to Whisper Escape - The premier writing competition, for team matrix, by the team matrix!!"
                      delay={1000}
                      className="w-full backdrop-blur-xl"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs text-gray-400">Start Date</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-400" />
                          <span className="text-sm">June 20, 2025</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs text-gray-400">End Date</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-400" />
                          <span className="text-sm">July 15, 2025</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs text-gray-400">Prize</div>
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-amber-400" />
                          <span className="text-sm">
                            Something as cool as this event!
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <div className="text-xs text-gray-400">
                          Participants
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-400" />
                          <span className="text-sm">
                            Our beloved Team, From first to the final year!
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-blue-400" />
                        <span>Topics: Anything that floats your boat</span>
                      </div>
                      <div className="text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-400" />
                        <span>Format: 450-500 words</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <TechButton
                      variant="cyber"
                      className="w-full h-12 rounded-xl text-lg font-medium shadow-lg shadow-purple-500/20 mt-4"
                      glowing={true}
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                    >
                      <Link
                        href="/register"
                        className="w-full flex items-center justify-center"
                      >
                        Register Now
                      </Link>
                    </TechButton>
                  </CardFooter>
                </GlassMorphism>
              </ThreeDCard>
            </FloatingElement>
          </motion.div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-24 relative border-t border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-purple-900/5 -z-10"></div>
        <div className="absolute inset-0 bg-dot-matrix opacity-10 -z-10"></div>
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-1/4 right-1/4 w-[30rem] h-[30rem] rounded-full bg-blue-500/5 blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[20rem] h-[20rem] rounded-full bg-purple-500/5 blur-[80px]" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Competition Statistics
            </h2>
            <p className="mt-4 text-lg text-white/70 max-w-2xl mx-auto">
              Reveal your creative prowess now!
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={popIn} className="relative">
                <AnimatedGradientBorder
                  borderWidth="2px"
                  borderRadius="rounded-xl"
                  animationDuration={8}
                  gradientColors={
                    stat.borderColor
                      .replace("border-", "from-")
                      .replace("/30", "/40") + " via-white/10 to-blue-600/30"
                  }
                >
                  <GlassMorphism
                    className="p-6 h-full flex flex-col items-center justify-center text-center shadow-lg rounded-xl"
                    blur="lg"
                  >
                    <motion.div
                      className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-black/30 to-black/10 backdrop-blur-md shadow-inner border border-white/5"
                      whileHover={{
                        rotate: [0, -5, 5, -5, 0],
                        scale: 1.05,
                        transition: { duration: 0.5 },
                      }}
                    >
                      {stat.icon}
                    </motion.div>

                    <StatCounter
                      value={stat.value.replace(/\D/g, "")}
                      suffix={stat.value.includes("+") ? "+" : ""}
                      prefix={stat.value.startsWith("₹") ? "₹" : ""}
                      textSize="text-3xl md:text-4xl lg:text-5xl"
                      color="text-white"
                      className="font-bold relative"
                      animateToValue={true}
                      decimal={0}
                    />
                    <p className="text-white/70 mt-3 font-medium">
                      {stat.label}
                    </p>
                  </GlassMorphism>
                </AnimatedGradientBorder>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>{" "}
      {/* Timeline Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-30">
          <MatrixRainBackground opacity={0.05} speed={0.5} fontSize={12} />
        </div>
        <div className="absolute inset-0 -z-20">
          <TechBackground particleCount={70} />
        </div>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SectionHeading
              title={
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-primary to-purple-400">
                  Competition Timeline
                </span>
              }
              subtitle={
                <span className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4 text-primary animate-pulse" />
                  <span>Registrations are live</span>
                </span>
              }
            />
          </motion.div>

          <div className="relative mt-20 max-w-4xl mx-auto">
            {/* Vertical line */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600/80 via-purple-600/80 to-blue-600/80 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
              initial={{ height: 0 }}
              whileInView={{ height: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            ></motion.div>

            {/* Current date indicator */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center"
              initial={{ opacity: 0, y: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ top: "30%" }}
            >
              <div className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-xs font-medium text-white shadow-lg shadow-amber-500/30 flex items-center space-x-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                <span>Today</span>
              </div>
              <div className="h-6 w-0.5 bg-amber-500" />
            </motion.div>

            {/* Timeline events */}
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                className="relative mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
              >
                <div
                  className={`flex ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } items-center`}
                >
                  <div
                    className={`w-1/2 px-6 lg:px-10 ${
                      index % 2 === 0 ? "text-right" : "text-left"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 10,
                      }}
                    >
                      {" "}
                      <GlassMorphism
                        className={`p-5 ${
                          index % 2 === 0 ? "ml-auto" : "mr-auto"
                        } max-w-xs shadow-xl ${
                          event.highlight && event.color === "amber"
                            ? "border border-amber-500/30"
                            : event.highlight && event.color === "blue"
                            ? "border border-blue-500/30"
                            : event.highlight && event.color === "green"
                            ? "border border-green-500/30"
                            : event.highlight && event.color === "purple"
                            ? "border border-purple-500/30"
                            : event.highlight && event.color === "emerald"
                            ? "border border-emerald-500/30"
                            : "border-white/5"
                        } ${
                          event.status === "active" && event.color === "amber"
                            ? "shadow-amber-500/20"
                            : event.status === "active" &&
                              event.color === "blue"
                            ? "shadow-blue-500/20"
                            : event.status === "active" &&
                              event.color === "green"
                            ? "shadow-green-500/20"
                            : event.status === "active" &&
                              event.color === "purple"
                            ? "shadow-purple-500/20"
                            : event.status === "active" &&
                              event.color === "emerald"
                            ? "shadow-emerald-500/20"
                            : ""
                        }`}
                        blur="md"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`p-2 rounded-lg flex items-center justify-center ${
                              index % 2 === 0 ? "order-last ml-auto" : ""
                            } ${
                              event.color === "amber"
                                ? "bg-amber-500/20"
                                : event.color === "blue"
                                ? "bg-blue-500/20"
                                : event.color === "green"
                                ? "bg-green-500/20"
                                : event.color === "purple"
                                ? "bg-purple-500/20"
                                : event.color === "emerald"
                                ? "bg-emerald-500/20"
                                : ""
                            }`}
                          >
                            {event.icon}
                          </div>
                          <Badge
                            className={`${
                              event.status === "completed"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : event.status === "active" &&
                                  event.color === "amber"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : event.status === "active" &&
                                  event.color === "blue"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : event.status === "active" &&
                                  event.color === "green"
                                ? "bg-green-500/20 text-green-300 border-green-500/30"
                                : event.status === "active" &&
                                  event.color === "purple"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : event.status === "active" &&
                                  event.color === "emerald"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                            } px-2 py-1 text-xs`}
                          >
                            {event.status === "completed"
                              ? "Completed"
                              : event.status === "active"
                              ? "Current"
                              : "Upcoming"}
                          </Badge>
                        </div>

                        <h3
                          className={`text-xl font-bold mb-2 ${
                            event.status !== "upcoming" &&
                            event.color === "amber"
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-300"
                              : event.status !== "upcoming" &&
                                event.color === "blue"
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-300"
                              : event.status !== "upcoming" &&
                                event.color === "green"
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-300"
                              : event.status !== "upcoming" &&
                                event.color === "purple"
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-300"
                              : event.status !== "upcoming" &&
                                event.color === "emerald"
                              ? "bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-300"
                              : ""
                          }`}
                        >
                          {event.title}
                        </h3>

                        <p className="text-white/70 text-sm mb-3">
                          {event.description}
                        </p>

                        <div className="flex items-center gap-2 text-white/60 text-sm mt-4">
                          <Calendar
                            className={`h-3.5 w-3.5 ${
                              event.color === "amber"
                                ? "text-amber-400"
                                : event.color === "blue"
                                ? "text-blue-400"
                                : event.color === "green"
                                ? "text-green-400"
                                : event.color === "purple"
                                ? "text-purple-400"
                                : event.color === "emerald"
                                ? "text-emerald-400"
                                : ""
                            }`}
                          />
                          <span className="font-medium">{event.date}</span>
                        </div>

                        {event.status === "active" && (
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <TechButton
                              size="sm"
                              variant="outline"
                              className="w-full text-xs"
                            >
                              <Link href="/register">Register Now</Link>
                            </TechButton>
                          </div>
                        )}
                      </GlassMorphism>
                    </motion.div>
                  </div>{" "}
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 w-14 h-14 z-10"
                    whileHover={{
                      scale: 1.2,
                      rotate: event.status === "completed" ? 360 : 0,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <AnimatedGradientBorder
                      borderRadius="rounded-full"
                      gradientColors={
                        event.status === "completed"
                          ? "from-green-500 via-green-400 to-green-500"
                          : event.status === "active" && event.color === "amber"
                          ? "from-amber-500 via-amber-400 to-amber-500"
                          : event.status === "active" && event.color === "blue"
                          ? "from-blue-500 via-blue-400 to-blue-500"
                          : event.status === "active" && event.color === "green"
                          ? "from-green-500 via-green-400 to-green-500"
                          : event.status === "active" &&
                            event.color === "purple"
                          ? "from-purple-500 via-purple-400 to-purple-500"
                          : event.status === "active" &&
                            event.color === "emerald"
                          ? "from-emerald-500 via-emerald-400 to-emerald-500"
                          : "from-gray-600 via-gray-500 to-gray-600"
                      }
                      borderWidth="3px"
                      animationDuration={event.status !== "upcoming" ? 3 : 0}
                      containerClassName="h-full w-full"
                    >
                      <div className="h-full w-full rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">
                        {event.status === "completed" ? (
                          <Check className="h-6 w-6 text-green-400" />
                        ) : event.status === "active" ? (
                          <div
                            className={`w-4 h-4 rounded-full animate-pulse ${
                              event.color === "amber"
                                ? "bg-amber-500"
                                : event.color === "blue"
                                ? "bg-blue-500"
                                : event.color === "green"
                                ? "bg-green-500"
                                : event.color === "purple"
                                ? "bg-purple-500"
                                : event.color === "emerald"
                                ? "bg-emerald-500"
                                : ""
                            }`}
                          />
                        ) : (
                          <div className="w-3 h-3 bg-gray-400/70 rounded-full" />
                        )}
                      </div>
                    </AnimatedGradientBorder>
                  </motion.div>
                  <div className="w-1/2 px-6 lg:px-10"></div>
                </div>
                {/* Connecting line to next item */}
                {index < timelineEvents.length - 1 && (
                  <motion.div
                    className="absolute left-1/2 transform -translate-x-1/2 z-5 w-1"
                    style={{
                      top: "100%",
                      height: "2rem",
                      background: `linear-gradient(to bottom, ${
                        event.status !== "upcoming"
                          ? event.color === "amber"
                            ? "#f59e0b"
                            : event.color === "blue"
                            ? "#3b82f6"
                            : event.color === "green"
                            ? "#10b981"
                            : event.color === "purple"
                            ? "#8b5cf6"
                            : event.color === "emerald"
                            ? "#10b981"
                            : "#4b5563"
                          : "#4b5563"
                      } 0%, ${
                        timelineEvents[index + 1].status !== "upcoming"
                          ? timelineEvents[index + 1].color === "amber"
                            ? "#f59e0b"
                            : timelineEvents[index + 1].color === "blue"
                            ? "#3b82f6"
                            : timelineEvents[index + 1].color === "green"
                            ? "#10b981"
                            : timelineEvents[index + 1].color === "purple"
                            ? "#8b5cf6"
                            : timelineEvents[index + 1].color === "emerald"
                            ? "#10b981"
                            : "#4b5563"
                          : "#4b5563"
                      } 100%)`,
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Top Entries Section with Tab Navigation */}
      <section className="py-24 relative border-t border-white/5">
        <div className="absolute inset-0 bg-black/30 -z-30" />
        <div className="absolute inset-0 -z-20">
          <MatrixRainBackground opacity={0.08} speed={0.8} fontSize={14} />
        </div>
        <div className="absolute inset-0 -z-10">
          <TechBackground particleCount={60} />
        </div>

        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg backdrop-blur-sm">
                <TrendingUp className="h-4 w-4 text-amber-300" />
                <span>Most Popular Submissions</span>
              </Badge>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <SectionHeading
                title={
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-orange-400">
                    Top Entries
                  </span>
                }
                subtitle="Check out the highest voted submissions in the competition"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full mt-10"
            >
              <GlassMorphism className="p-1 rounded-full backdrop-blur-lg">
                <Tabs defaultValue="top" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-transparent p-1">
                    <TabsTrigger
                      value="top"
                      className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 py-2.5"
                    >
                      <Award className="h-4 w-4 mr-2" /> Top 5 Entries
                    </TabsTrigger>
                    <TabsTrigger
                      value="recent"
                      className="rounded-full data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300 py-2.5"
                    >
                      <Clock className="h-4 w-4 mr-2" /> Recent Entries
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="top">
                    {loadingEntries ? (
                      <div className="flex justify-center items-center py-16">
                        <div className="animate-pulse rounded-full h-16 w-16 bg-primary/20 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        </div>
                      </div>
                    ) : topEntries.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10"
                      >
                        <FileText className="w-12 h-12 mx-auto mb-4 text-primary opacity-80" />
                        <h3 className="text-2xl font-bold mb-2">
                          No Entries Yet
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          Be the first to submit your entry to the competition!
                        </p>
                        <Link href="/register">
                          <Button className="px-6 rounded-full">
                            Submit Entry
                          </Button>
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.div
                        className="pt-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        {/* All Top Entries with Pagination */}
                        <div className="mt-12">
                          <h3 className="text-xl font-semibold mb-6 flex items-center">
                            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                            Top 5 Entries
                          </h3>

                          <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                          >
                            {currentTopEntries.map((entry, index) => (
                              <motion.div key={entry.id} variants={fadeInUp}>
                                <div className="relative">
                                  <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold z-10">
                                    #{index + 1}
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
                          </motion.div>
                        </div>
                        <div className="flex justify-center mt-10">
                          <Link href="/entries">
                            <AnimatedGradientBorder
                              borderWidth="2px"
                              borderRadius="rounded-full"
                              gradientColors="from-primary via-accent to-primary"
                              animationDuration={8}
                              containerClassName="w-fit"
                            >
                              <Button
                                variant="outline"
                                className="gap-2 rounded-full px-6 py-6 bg-black/50 backdrop-blur-md hover:bg-black/70 transition-colors duration-300 text-base font-medium border-transparent"
                              >
                                View All Entries
                                <ArrowRight className="h-5 w-5" />
                              </Button>
                            </AnimatedGradientBorder>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </TabsContent>
                  <TabsContent value="recent">
                    {loadingEntries ? (
                      <div className="flex justify-center items-center py-16">
                        <div className="animate-pulse rounded-full h-16 w-16 bg-primary/20 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                        </div>
                      </div>
                    ) : (
                      <motion.div
                        className="pt-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        id="recent-entries-container"
                      >
                        {/* Header for recent entries with animated subtitle */}
                        <motion.div
                          className="mb-10 text-center"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <h3 className="text-2xl font-bold text-white mb-2">
                            Latest Submissions
                          </h3>
                          <div className="flex items-center justify-center gap-1.5 text-sm text-primary">
                            <Clock className="h-4 w-4" />
                            <span>Updated 6/12/2025</span>
                          </div>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {entries.slice(0, 6).map((entry, index) => (
                            <motion.div
                              key={entry.id}
                              variants={fadeInUp}
                              className="w-full h-full"
                              custom={index}
                              transition={{ delay: index * 0.1 }}
                            >
                              <EntryCard
                                entry={entry}
                                user={user}
                                hasVoted={hasVoted}
                                votingFor={votingFor}
                                handleVote={handleVote}
                                className="w-full h-full"
                              />
                            </motion.div>
                          ))}
                        </div>
                        <div className="flex justify-center mt-8">
                          <Link href="/entries">
                            <Button
                              variant="outline"
                              className="gap-2 rounded-full"
                            >
                              View All Entries
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </TabsContent>
                </Tabs>
              </GlassMorphism>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features section */}
      <section className="py-20 relative overflow-hidden">
        {" "}
        <div className="absolute inset-0 bg-grid-small-white/5 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10" />
        <div className="container mx-auto px-4 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <SectionHeading
              title="Why Participate?"
              subtitle="Benefits of joining Whisper Escape"
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {keyFeatures.map((feature, index) => (
              <FloatingElement
                key={index}
                distance={8}
                duration={4}
                delay={index * 0.5}
              >
                <motion.div variants={popIn} className="h-full">
                  <ThreeDCard
                    className="h-full bg-black/60 backdrop-blur-md border border-white/5 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300"
                    glareEnabled={true}
                    glareMaxOpacity={0.15}
                    glareColor={`rgba(255, 255, 255, 0.15)`}
                    borderColor={`rgba(255, 255, 255, 0.1)`}
                  >
                    <CardHeader className="pb-2">
                      <AnimatedGradientBorder
                        borderWidth="2px"
                        borderRadius="rounded-xl"
                        containerClassName="w-fit"
                        gradientColors={`${feature.color} via-white/30`}
                      >
                        <div
                          className={`h-16 w-16 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center shadow-lg`}
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 8, -8, 0],
                              scale: [1, 1.15, 1],
                            }}
                            transition={{
                              duration: 5,
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: index * 0.3,
                            }}
                          >
                            {feature.icon}
                          </motion.div>
                        </div>
                      </AnimatedGradientBorder>
                      <CardTitle className="mt-5 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-white/70 text-sm md:text-base">
                        {feature.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <GlowingButton
                        variant="ghost"
                        size="sm"
                        className="w-full justify-center group"
                        glowColor={feature.color.split(" ")[1]}
                      >
                        <span className="mr-2">Learn more</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                          }}
                        >
                          <ChevronRight className="h-4 w-4 group-hover:text-white transition-colors" />
                        </motion.span>
                      </GlowingButton>
                    </CardFooter>
                  </ThreeDCard>
                </motion.div>
              </FloatingElement>
            ))}
          </motion.div>
        </div>
      </section>
      {/* Testimonial/Quote Section */}
      <section className="py-16 bg-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-dot-matrix opacity-20" />
        </div>
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            className="text-center relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl font-serif text-primary/40 absolute top-0 left-0">
              &ldquo;
            </div>
            <div className="text-6xl font-serif text-primary/40 absolute bottom-0 right-4">
              &rdquo;
            </div>
            <blockquote className="text-xl md:text-2xl italic px-12 py-8">
              Writing is the painting of the voice. Whisper Escape is a canvas
              where your words can dance, inspire, and create a symphony! Ink
              the anonumous and ditch the tag. NOW!
            </blockquote>
            <div className="mt-6 flex items-center justify-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <div className="ml-4 text-left">
                <p className="font-semibold">The Editorial Council</p>
                <p className="text-sm text-muted-foreground">Team Matrix JEC</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden border-t border-primary/10">
        <div className="absolute inset-0 -z-30">
          <TechBackground particleCount={40} />
        </div>
        <div className="absolute inset-0 -z-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-[120px]" />
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm -z-10"></div>
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-5xl mx-auto">
            <ThreeDCard
              className="overflow-hidden"
              glareEnabled={true}
              glareColor="rgba(139, 92, 246, 0.15)"
              borderColor="rgba(139, 92, 246, 0.2)"
            >
              <GlassMorphism className="p-10 backdrop-blur-xl rounded-xl">
                <div className="text-center space-y-8">
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mx-auto"
                  >
                    <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30 px-5 py-2.5 rounded-full flex items-center gap-2.5 mx-auto w-fit shadow-lg backdrop-blur-sm">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Flame className="h-5 w-5 text-amber-300" />
                      </motion.div>
                      <span className="text-base">Limited Spots Available</span>
                    </Badge>
                  </motion.div>

                  <div className="space-y-4">
                    <AnimatedGradientBorder
                      borderRadius="rounded-lg"
                      containerClassName="inline-flex mx-auto"
                      borderWidth="2px"
                      gradientColors="from-blue-600 via-purple-600 to-blue-600"
                      animationDuration={6}
                    >
                      <motion.h2
                        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-300% animate-gradient-fast px-6 py-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                      >
                        Ready to showcase your writing talent?
                      </motion.h2>
                    </AnimatedGradientBorder>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <TerminalDisplay
                        text="Be part of the most exciting writing competition. Time is ticking!"
                        className="max-w-2xl mx-auto my-8"
                      />
                    </motion.div>
                    <motion.div
                      className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <TechButton
                        size="lg"
                        variant="matrix"
                        className="w-full sm:w-auto px-10 py-6 text-lg font-semibold"
                        glowing={true}
                        rightIcon={<ArrowRight className="h-5 w-5" />}
                      >
                        <Link
                          href="/register"
                          className="w-full flex items-center justify-center"
                        >
                          Register Now
                        </Link>
                      </TechButton>
                      <TechButton
                        variant="ghost"
                        size="lg"
                        className="w-full sm:w-auto px-8 py-6 text-lg font-semibold"
                      >
                        <Link
                          href="/guidelines"
                          className="w-full flex items-center justify-center"
                        >
                          View Guidelines
                        </Link>
                      </TechButton>
                    </motion.div>
                    <motion.div
                      className="pt-12"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                    >
                      <p className="text-sm text-white/60 flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Competition starts on June 20, 2025
                      </p>
                    </motion.div>
                  </div>
                </div>
              </GlassMorphism>
            </ThreeDCard>
          </div>
        </div>
      </section>
    </main>
  );
}
//deployment check