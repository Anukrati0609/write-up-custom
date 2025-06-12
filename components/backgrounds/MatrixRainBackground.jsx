"use client";

import React, { useEffect, useRef } from "react";

const MatrixRainBackground = ({ opacity = 0.2, speed = 1, fontSize = 15 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Matrix characters - using a mix of characters for a tech look
    const chars =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>[]{}|:;/*-+=#@$%^&*()_~";

    // Setting up the columns
    const font_size = fontSize;
    const columns = canvas.width / font_size;

    // Array to store drops
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
    }

    // Draw the characters
    const draw = () => {
      // Black BG with alpha for the trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${0.04 / speed})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set color and font for characters
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(66, 153, 225, 0.7)"); // Blue
      gradient.addColorStop(0.5, "rgba(139, 92, 246, 0.7)"); // Purple
      gradient.addColorStop(1, "rgba(59, 130, 246, 0.7)"); // Blue

      ctx.fillStyle = gradient;
      ctx.font = `${font_size}px monospace`;

      // Looping over drops
      for (let i = 0; i < drops.length; i++) {
        // Get a random character
        const text = chars[Math.floor(Math.random() * chars.length)];

        // Draw the character
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        // Reset drops
        if (drops[i] * font_size > canvas.height && Math.random() > 0.98) {
          drops[i] = 0;
        }

        // Move drops down
        drops[i]++;
      }
    };

    // Animation loop
    let animationFrameId;
    const animate = () => {
      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [fontSize, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0`}
      style={{ opacity }}
    />
  );
};

export default MatrixRainBackground;
