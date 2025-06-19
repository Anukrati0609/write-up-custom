"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  Code,
  FileText,
  ExternalLink,
  Globe,
  Terminal,
  User,
  Sparkles,
  Zap,
  Layers,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Heart,
  Clock,
  CalendarDays,
  ArrowRight,
  LucideIcon,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { EnhancedNavLink } from "@/components/EnhancedNavLink";
import AnimatedGradientBorder from "@/components/ui/animated-gradient-border";
import { useUserStore } from "@/store/useUserStore";

const Header = () => {
  const { user, signOut } = useUserStore();
  console.log("Header component loaded", user);
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("/"); // Default to home page
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Set active tab based on current path
    if (typeof window !== "undefined") {
      setActiveTab(window.location.pathname);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const headerVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const badgeVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.3, duration: 0.4, type: "spring", stiffness: 200 },
    },
  };
  const glowEffect = {
    hidden: { opacity: 0.5, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 2.5,
      },
    },
  };

  const navItems = [
    { href: "/", label: "Home", icon: Globe },
    { href: "/about", label: "About", icon: FileText },
    { href: "/guidelines", label: "Guidelines", icon: Terminal },
    { href: "/register", label: "Register", icon: User },
  ];

  return (
    <>
      <motion.header
        initial="initial"
        animate="animate"
        variants={headerVariants}
        className={`sticky top-0 z-50 w-full border-b backdrop-blur-lg ${
          isScrolled
            ? "bg-background/75 shadow-sm border-b border-slate-200/20 dark:border-slate-700/20"
            : "bg-background/60"
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-primary via-violet-600 to-purple-700 flex items-center justify-center shadow-lg">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={glowEffect}
                className="absolute inset-0 bg-[url('/window.svg')] bg-center bg-no-repeat bg-contain opacity-80 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-grid-small-white/10 mix-blend-overlay" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/file.svg"
                alt="Whisper Escape Logo"
                width={24}
                height={24}
                className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground leading-tight tracking-tight">
                <span className="relative inline-block">Matrix</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                  Whisper Escape
                </span>
              </span>
              <motion.div variants={badgeVariants}>
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 h-4 bg-muted/50 border border-primary/20 dark:border-primary/20 shadow-sm"
                >
                  <Sparkles className="h-2.5 w-2.5 mr-1 text-primary" />
                  2025 Edition
                </Badge>
              </motion.div>
            </div>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center">
              {navItems.map((item) => (
                <EnhancedNavLink
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeTab === item.href}
                />
              ))}
            </nav>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full border border-slate-200 dark:border-slate-800 p-0 overflow-hidden group"
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-violet-500/10 to-purple-500/10 transition-opacity duration-300" />
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.displayName} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {user.displayName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2">
                    <User className="h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> My Submissions
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-500 flex items-center gap-2"
                    onClick={signOut}
                  >
                    <Zap className="h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <AnimatedGradientBorder
                  borderRadius="rounded-md"
                  gradientColors="from-primary via-violet-600 to-purple-600"
                >
                  <Button
                    asChild
                    variant="default"
                    size="sm"
                    className="relative overflow-hidden group z-10 bg-transparent"
                  >
                    <Link href="/register" className="flex items-center gap-1">
                      Register
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                </AnimatedGradientBorder>
              </div>
            )}
          </div>
          {/* Mobile Menu */}
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg bg-background/80 border border-primary/20 hover:bg-primary/10 transition-colors relative z-10"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[80vw] sm:w-[350px] pr-0 border-l border-slate-200/20 dark:border-slate-800/20"
              >
                <div className="px-2">
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-primary via-violet-600 to-purple-700 flex items-center justify-center shadow-lg">
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={glowEffect}
                        className="absolute inset-0 bg-[url('/window.svg')] bg-center bg-no-repeat bg-contain opacity-80 mix-blend-overlay"
                      />
                      <div className="absolute inset-0 bg-grid-small-white/10 mix-blend-overlay" />
                      <Image
                        src="/file.svg"
                        alt="Whisper Escape Logo"
                        width={22}
                        height={22}
                        className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300"
                        priority
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-foreground leading-tight tracking-tight">
                        Matrix
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                          Whisper Escape
                        </span>
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] py-0 h-4 bg-muted/50 border border-primary/20 dark:border-primary/20 shadow-sm"
                      >
                        <Sparkles className="h-2.5 w-2.5 mr-1 text-primary" />
                        2025 Edition
                      </Badge>
                    </div>
                  </Link>
                </div>
                <nav className="grid gap-2 px-2">
                  <div className="py-3">
                    <motion.div
                      className="flex items-center justify-between mb-3"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h4 className="text-xs font-semibold text-foreground/70 flex items-center gap-1.5">
                        <Globe className="h-3.5 w-3.5" /> Navigation
                      </h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full"
                        onClick={() => setOpen(true)}
                      >
                        <Search className="h-3 w-3" />
                      </Button>
                    </motion.div>
                    <div className="grid gap-1">
                      {navItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <EnhancedNavLink
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={activeTab === item.href}
                            isMobile={true}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {user ? (
                    <motion.div
                      className="py-3 border-t border-slate-200/20 dark:border-slate-800/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="mb-2 text-xs font-semibold text-foreground/70 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5" /> Account
                      </h4>
                      <AnimatedGradientBorder
                        borderRadius="rounded-xl"
                        borderWidth={1}
                        gradientColors="from-primary/50 via-violet-500/50 to-purple-500/50"
                        className="p-3 bg-background/80 backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-slate-200/20 dark:border-slate-800/20">
                            <AvatarImage
                              src={user.photoURL}
                              alt={user.displayName}
                            />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {user.displayName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {user.displayName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </AnimatedGradientBorder>
                      <div className="grid gap-1 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 border-slate-200/20 dark:border-slate-800/20"
                        >
                          <Layers className="h-3.5 w-3.5" /> Profile Settings
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="justify-start gap-2 text-red-500 border-slate-200/20 dark:border-slate-800/20"
                          onClick={signOut}
                        >
                          <Zap className="h-3.5 w-3.5" /> Log Out
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      className="grid gap-2 pt-4 border-t border-slate-200/20 dark:border-slate-800/20"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <AnimatedGradientBorder
                        borderRadius="rounded-md"
                        gradientColors="from-primary via-violet-600 to-purple-600"
                      >
                        <Button
                          asChild
                          size="sm"
                          variant="default"
                          className="w-full relative overflow-hidden bg-transparent"
                        >
                          <Link
                            href="/register"
                            className="relative z-10 flex items-center justify-center gap-2"
                          >
                            Register <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </AnimatedGradientBorder>
                    </motion.div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      {/* Search Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle className="sr-only">Search Navigation</DialogTitle>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {navItems.map((item) => (
              <CommandItem
                key={item.href}
                onSelect={() => {
                  setOpen(false);
                  window.location.href = item.href;
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Header;
