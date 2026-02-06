"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface ScoreRingProps {
  score: number;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 71) return "var(--praise)";
  if (score >= 41) return "var(--performance)";
  return "var(--bug)";
}

export function ScoreRing({ score, className }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const progress = useMotionValue(0);
  const strokeDashoffset = useTransform(progress, (v) => circumference - (v / 100) * circumference);

  useEffect(() => {
    const controls = animate(progress, score, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, progress]);

  const color = getScoreColor(score);

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-text-primary">{displayScore}</span>
        <span className="text-xs text-text-secondary">/100</span>
      </div>
    </div>
  );
}
