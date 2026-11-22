"use client";

import { useEffect, useRef } from "react";

export function MatrixRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const chars = "010101";
    const fontSize = 18;
    const colSpacing = 48;
    const columns = Math.floor(width / colSpacing);
    const drops: number[] = new Array(columns)
      .fill(1)
      .map(() => Math.floor(Math.random() * -40));

    let lastDraw = Date.now();
    const fps = 12;
    const interval = 1000 / fps;

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw);

      const now = Date.now();
      const delta = now - lastDraw;
      if (delta < interval) return;
      lastDraw = now - (delta % interval);

      // Soft amber-dark clear
      ctx.fillStyle = "rgba(13, 11, 4, 0.25)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        if (i % 3 !== 0) continue;

        const char = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * colSpacing;
        const y = drops[i] * fontSize;

        // Amber glow rain instead of green
        ctx.fillStyle = "rgba(245, 158, 11, 0.12)";
        ctx.fillText(char, x, y);

        if (y > height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-20 mix-blend-screen"
    />
  );
}
