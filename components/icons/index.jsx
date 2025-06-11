"use client";

import React from "react";
import { FiFile } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { FiArrowRight } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { HiBadgeCheck } from "react-icons/hi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { motion } from "framer-motion";

export const FileIcon = ({ className = "h-6 w-6", ...props }) => {
  return <FiFile className={className} {...props} />;
};

export const HomeIcon = ({ className = "h-6 w-6", ...props }) => {
  return <FiHome className={className} {...props} />;
};

export const CheckIcon = ({
  className = "h-6 w-6",
  animate = false,
  ...props
}) => {
  if (!animate) {
    return <FiCheck className={className} {...props} />;
  }

  return (
    <motion.div className={className}>
      <motion.div
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <FiCheck className="h-full w-full text-green-500" strokeWidth={2.5} />
      </motion.div>
    </motion.div>
  );
};

export const TechCircleIcon = ({
  className = "h-24 w-24 opacity-20",
  ...props
}) => {
  return (
    <div className={className} {...props}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke="currentColor"
          strokeWidth="0.5"
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="currentColor"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

export const MenuIcon = ({ className = "h-4 w-4", ...props }) => {
  return <HiOutlineMenuAlt2 className={className} {...props} />;
};

export const ArrowRightIcon = ({ className = "h-5 w-5", ...props }) => {
  return <FiArrowRight className={className} {...props} />;
};

export const UserIcon = ({ className = "h-6 w-6", ...props }) => {
  return <FiUser className={className} {...props} />;
};

export const EditIcon = ({ className = "h-6 w-6", ...props }) => {
  return <FiEdit className={className} {...props} />;
};

export const BadgeIcon = ({ className = "h-5 w-5", ...props }) => {
  return <HiBadgeCheck className={className} {...props} />;
};

export const CheckCircleIcon = ({ className = "h-5 w-5", ...props }) => {
  return <IoMdCheckmarkCircle className={className} {...props} />;
};
