"use client";

import React from "react";
import ParticleBackground from "./ParticleBackground";
import CircuitLinesBackground from "./CircuitLinesBackground";

export const TechBackground = ({ particleCount = 60 }) => {
  return (
    <>
      <ParticleBackground count={particleCount} />
      <CircuitLinesBackground />
    </>
  );
};

export default TechBackground;
