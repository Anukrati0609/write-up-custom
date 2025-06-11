"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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

// Custom Components
import TechBackground from "@/components/backgrounds/TechBackground";
import AnimatedCard from "@/components/ui/animated-card";
import SectionHeading from "@/components/ui/section-heading";
import AnimatedGradientBorder from "@/components/ui/animated-gradient-border";

// Store
import { useUserStore } from "@/store/useUserStore";

export default function Home() {
  const { user, getEntries, initializeAuth } = useUserStore();
  const [entries, setEntries] = useState([]);
  const [featuredEntries, setFeaturedEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);

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

          // Set top 3 for featured section
          setFeaturedEntries(sortedEntries.slice(0, 3));

          // Set all entries for later use
          setEntries(sortedEntries);
        }
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoadingEntries(false);
      }
    }

    fetchEntries();
  }, [getEntries, user]);

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

  // Statistics data
  const stats = [
    {
      icon: <FileText className="h-6 w-6 text-blue-400" />,
      value: "120+",
      label: "Submissions",
      bgColor: "bg-blue-500/20",
      borderColor: "border-blue-500/30",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-400" />,
      value: "500+",
      label: "Participants",
      bgColor: "bg-purple-500/20",
      borderColor: "border-purple-500/30",
    },
    {
      icon: <Award className="h-6 w-6 text-emerald-400" />,
      value: "₹10K",
      label: "Prize Pool",
      bgColor: "bg-emerald-500/20",
      borderColor: "border-emerald-500/30",
    },
  ];

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <TechBackground particleCount={80} />
        </div>
        <div className="absolute inset-0 bg-tech-grid -z-10" />
        <div className="absolute inset-0 bg-dot-matrix -z-10" />
        <div className="absolute inset-0 bg-gradient-animate -z-10" />
        <div className="absolute inset-0 flex items-center justify-center -z-10">
          <div className="w-[50rem] h-[50rem] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <motion.div
            className="flex-1 max-w-2xl space-y-6"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-md flex items-center gap-1.5 w-fit">
              <Calendar className="h-3.5 w-3.5" />
              <span>Registration Open Until June 14, 2025</span>
            </Badge>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
              Matrix{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary bg-300% animate-gradient">
                WriteItUp
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Unleash your creative potential in the ultimate content writing
              competition organized by Matrix JEC - the skill enhancement
              community of Jabalpur Engineering College.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="font-medium bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-500 border-none shadow-lg hover:shadow-primary/20 w-full sm:w-auto"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    Register Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-primary/20 hover:bg-primary/5 w-full sm:w-auto"
                >
                  <Link href="/guidelines">Learn More</Link>
                </Button>
              </motion.div>
            </div>

            <div className="pt-6 flex gap-4 items-center">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500/80 to-purple-700/80 border-2 border-background flex items-center justify-center text-xs font-medium text-white"
                  >
                    {String.fromCharCode(64 + i)}
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">120+</span>{" "}
                participants already registered
              </p>
            </div>
          </motion.div>

          {/* Right content - Register Card */}
          <motion.div
            className="w-full md:w-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-md opacity-50 animate-slow-pulse"></div>
            <Card className="backdrop-blur-sm border shadow-xl md:min-w-[400px] relative">
              <div className="absolute inset-0 bg-dot-matrix opacity-40 rounded-xl pointer-events-none"></div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <Image
                      src="/file.svg"
                      alt="WriteItUp"
                      width={24}
                      height={24}
                    />
                  </div>
                  <div>
                    <CardTitle>WriteItUp Competition</CardTitle>
                    <CardDescription>2025 Edition</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm">
                      Competition Date
                    </h3>
                    <p className="font-medium">June 15 - June 30, 2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-secondary rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-muted-foreground text-sm">
                      Prize Pool
                    </h3>
                    <p className="font-medium">₹10,000 + Certificates</p>
                  </div>
                </div>

                <Separator className="my-2" />

                <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <strong className="font-medium">Only 5 days left!</strong>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    Register before June 14 to secure your spot in the
                    competition.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button
                  asChild
                  className="w-full font-medium relative overflow-hidden group"
                >
                  <Link href="/register">
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-purple-500 group-hover:opacity-90 transition-opacity opacity-80"></span>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Register Now <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Button>
                <p className="text-center text-muted-foreground text-xs">
                  Registration closes on June 14, 2025
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/20 relative overflow-hidden border-y border-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate={statsVisible ? "visible" : "hidden"}
                variants={counterVariants}
                transition={{ delay: index * 0.2 }}
                className={`${stat.bgColor} ${stat.borderColor} border rounded-xl p-6 backdrop-blur-sm shadow-lg`}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-background/40 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-muted-foreground text-sm">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 space-y-8">
          <SectionHeading
            title="Competition Categories"
            subtitle="Choose from diverse writing categories to showcase your talent"
          />

          <Tabs defaultValue="article" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="creative">Creative Writing</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>
            <TabsContent value="article">
              <AnimatedGradientBorder
                borderRadius="rounded-xl"
                gradientColors="from-blue-600 via-blue-500 to-sky-400"
                containerClassName="w-full"
              >
                <Card className="border-0 bg-black/70 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-400" />
                      Article Writing
                    </CardTitle>
                    <CardDescription>
                      Opinion pieces, features, and news articles
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                          ✓
                        </div>
                        <span>1500-2000 word count limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                          ✓
                        </div>
                        <span>Research-backed content required</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">
                          ✓
                        </div>
                        <span>
                          Topics include technology, society, environment
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </TabsContent>

            <TabsContent value="creative">
              <AnimatedGradientBorder
                borderRadius="rounded-xl"
                gradientColors="from-purple-600 via-violet-500 to-fuchsia-400"
                containerClassName="w-full"
              >
                <Card className="border-0 bg-black/70 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-400" />
                      Creative Writing
                    </CardTitle>
                    <CardDescription>
                      Short stories, poetry, and flash fiction
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
                          ✓
                        </div>
                        <span>Up to 3000 words for short stories</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
                          ✓
                        </div>
                        <span>Maximum 30 lines for poetry</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm">
                          ✓
                        </div>
                        <span>Free choice of theme and genre</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </TabsContent>

            <TabsContent value="technical">
              <AnimatedGradientBorder
                borderRadius="rounded-xl"
                gradientColors="from-emerald-600 via-teal-500 to-emerald-400"
                containerClassName="w-full"
              >
                <Card className="border-0 bg-black/70 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-emerald-400" />
                      Technical Writing
                    </CardTitle>
                    <CardDescription>
                      Documentation, guides, and technical blogs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
                          ✓
                        </div>
                        <span>2000-2500 word count limit</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
                          ✓
                        </div>
                        <span>Clear explanations of complex topics</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">
                          ✓
                        </div>
                        <span>Diagrams and visual aids encouraged</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </AnimatedGradientBorder>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 space-y-8">
          <SectionHeading
            title="Why Participate?"
            subtitle="Benefits of joining Matrix WriteItUp competition"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedCard
              className="border bg-card/50 backdrop-blur-sm"
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-blue-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>Showcase Your Talent</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Display your writing skills to a wider audience and gain
                  recognition among peers and industry professionals.
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard
              className="border bg-card/50 backdrop-blur-sm"
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-purple-600/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Expert Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Receive valuable feedback from industry experts and
                  experienced writers to improve your skills.
                </p>
              </CardContent>
            </AnimatedCard>

            <AnimatedCard
              className="border bg-card/50 backdrop-blur-sm"
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <CardHeader>
                <div className="h-12 w-12 bg-green-600/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Networking Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals and build relationships
                  that can help in your professional journey.
                </p>
              </CardContent>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Featured Entries Section */}
      <section className="py-16 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <TechBackground particleCount={40} />
        </div>
        <div className="container mx-auto px-4 space-y-8">
          <SectionHeading
            title="Featured Entries"
            subtitle="Check out some of the top submissions in our competition"
          />

          {loadingEntries && (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}

          {!loadingEntries && featuredEntries.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {featuredEntries.map((entry, index) => (
                <AnimatedCard
                  key={entry.id}
                  className="bg-card/70 backdrop-blur-sm border border-primary/10 rounded-xl overflow-hidden shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -8,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 line-clamp-1">
                          {entry.title}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>{entry.year}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <FileText className="h-3.5 w-3.5" />
                            <span>{entry.branch}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-red-500">
                        <Heart className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{entry.votes}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                      {truncateContent(entry.content)}
                    </p>

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-muted/20">
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleDateString()
                          : "Recently"}
                      </div>
                      <Link href="/entries">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs border-primary/20 hover:bg-primary/5 flex items-center gap-1.5"
                        >
                          Read more <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          )}

          {!loadingEntries && featuredEntries.length === 0 && (
            <motion.div
              className="text-center py-12 max-w-lg mx-auto bg-card/50 backdrop-blur-sm rounded-xl border border-primary/10 shadow-lg p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold mb-2">
                Submissions Coming Soon
              </h3>
              <p className="text-muted-foreground mb-6">
                Be among the first to submit your entry in the competition!
              </p>
              <AnimatedGradientBorder
                borderRadius="rounded-md"
                gradientColors="from-primary via-purple-500 to-indigo-500"
                containerClassName="inline-block"
              >
                <Button className="bg-transparent" asChild>
                  <Link href="/register" className="flex items-center gap-2">
                    Register Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </AnimatedGradientBorder>
            </motion.div>
          )}

          {!loadingEntries && featuredEntries.length > 0 && (
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="border-primary/20 hover:bg-primary/5 flex items-center gap-2"
                asChild
              >
                <Link href="/entries">
                  View All Entries <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden border-t border-primary/10">
        <div className="absolute inset-0 bg-grid-small-white/[0.2] -z-10" />
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[80px]" />
        </motion.div>

        <div className="container mx-auto px-4 text-center max-w-3xl space-y-6">
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 px-3 py-1.5 flex items-center gap-2 mx-auto w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Limited Spots Available</span>
          </Badge>

          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to showcase your writing talent?
          </h2>

          <p className="text-muted-foreground text-lg">
            Join Matrix WriteItUp 2025 and take your first step towards becoming
            a recognized writer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <AnimatedGradientBorder
                borderRadius="rounded-lg"
                gradientColors="from-blue-600 via-purple-600 to-indigo-600"
              >
                <Button
                  asChild
                  size="lg"
                  className="font-medium bg-transparent border-0"
                >
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-6"
                  >
                    Register Now <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </AnimatedGradientBorder>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary/20 hover:bg-primary/5"
              >
                <Link href="/guidelines">View Guidelines</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
