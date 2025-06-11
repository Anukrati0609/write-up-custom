"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FooterWrapper,
  FooterLink,
  FooterSection,
} from "@/components/FooterWrapper";
import {
  FileIcon,
  HomeIcon,
  ArrowRightIcon,
  CheckIcon,
  BadgeIcon,
  TechCircleIcon,
} from "@/components/icons";
import { Github, Twitter, Linkedin, Instagram, Heart } from "lucide-react";
import AnimatedGradientBorder from "./ui/animated-gradient-border";

const SocialLink = ({ href, icon: Icon, label }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 w-9 rounded-full bg-accent/50 hover:bg-accent flex items-center justify-center transition-colors group"
            aria-label={label}
        >
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </a>
    );
};

const FooterContent = () => {
  return (
    <FooterWrapper>
      <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
        <div className="flex items-center gap-4 mb-6 lg:mb-0">
          <div className="h-12 w-12 bg-gradient-to-br from-primary via-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-grid-small-white/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image
              src="/file.svg"
              alt="WriteItUp Logo"
              width={22}
              height={22}
              className="text-white relative z-10 transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <div>
            <h3 className="font-bold text-xl text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Matrix WriteItUp
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60"></span>
              <p className="text-xs text-muted-foreground">
                Content Writing Competition
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full lg:w-auto">
          <FooterSection title="Navigation">
            <FooterLink href="/" delay={0.1}>
              Home
            </FooterLink>
            <FooterLink href="/about" delay={0.2}>
              About
            </FooterLink>
            <FooterLink href="/guidelines" delay={0.3}>
              Guidelines
            </FooterLink>
            <FooterLink href="/register" delay={0.4}>
              Register
            </FooterLink>
          </FooterSection>

          <FooterSection title="Resources">
            <FooterLink href="#" delay={0.2}>
              Community
            </FooterLink>
            <FooterLink href="#" delay={0.3}>
              Past Competitions
            </FooterLink>
            <FooterLink href="#" delay={0.4}>
              FAQs
            </FooterLink>
            <FooterLink href="#" delay={0.5}>
              Contact Us
            </FooterLink>
          </FooterSection>

          <FooterSection title="Legal">
            <FooterLink href="#" delay={0.3}>
              Privacy Policy
            </FooterLink>
            <FooterLink href="#" delay={0.4}>
              Terms of Service
            </FooterLink>
            <FooterLink href="#" delay={0.5}>
              Cookie Policy
            </FooterLink>
          </FooterSection>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <SocialLink
              href="https://github.com/Matrix-JEC"
              icon={Github}
              label="GitHub"
            />
            <SocialLink
              href="www.linkedin.com/in/matrix-jec-2574412ab"
              icon={Linkedin}
              label="LinkedIn"
            />
            <SocialLink
              href="https://www.instagram.com/matrix.jec/"
              icon={Instagram}
              label="Instagram"
            />
          </div>

          <AnimatedGradientBorder
            className="px-4 py-1.5 text-xs text-center md:text-right"
            borderRadius="rounded-full"
            gradientColors="from-blue-500 via-purple-500 to-pink-500"
          >
            <p className="flex items-center justify-center gap-1.5">
              Designed & Developed with
              <Heart className="h-3 w-3 text-red-500 fill-red-500" />
              by Matrix JEC Tech Team
            </p>
          </AnimatedGradientBorder>

          <div className="backdrop-blur-sm bg-background/30 px-4 py-2.5 rounded-xl border border-slate-200/10 shadow-sm">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Matrix JEC - Skill Enhancement
              Community
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1 flex items-center justify-end gap-1">
              <span className="inline-block h-3 w-3 rounded-full bg-gradient-to-br from-primary to-purple-600 opacity-70"></span>
              Jabalpur Engineering College
            </p>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <TechCircleIcon className="absolute right-10 bottom-10 opacity-5 h-40 w-40" />
      <TechCircleIcon className="absolute left-10 top-10 opacity-5 h-28 w-28" />
    </FooterWrapper>
  );
};

export default FooterContent;
