"use client";

import React, { useState, useEffect } from "react";

export const ParticleBackground = ({ count = 60 }) => {
  const [particles, setParticles] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const generatedParticles = Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      animationDuration: Math.random() * 50 + 15,
      animationDelay: Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, [count]);

  if (!isMounted) {
    return <div className="absolute inset-0 overflow-hidden z-0"></div>;
  }

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            width: `${particle.width}px`,
            height: `${particle.height}px`,
            opacity: particle.opacity,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
          }}
        />
      ))}
      <style jsx>{`
        .particle {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: float linear infinite;
          filter: blur(0.5px);
        }
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -50px) rotate(120deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(240deg);
          }
          100% {
            transform: translate(0, 0) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ParticleBackground;
