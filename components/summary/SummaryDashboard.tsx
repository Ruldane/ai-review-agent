"use client";

import { motion } from "framer-motion";
import { ScoreRing } from "./ScoreRing";
import { VerdictBadge } from "./VerdictBadge";
import { StatsBar } from "./StatsBar";
import { TopPriority } from "./TopPriority";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import type { ReviewResult } from "@/types";

export interface SummaryDashboardProps {
  review: ReviewResult;
  onCategoryClick?: (category: string) => void;
  onTopPriorityClick?: () => void;
  className?: string;
}

export function SummaryDashboard({
  review,
  onCategoryClick,
  onTopPriorityClick,
  className,
}: SummaryDashboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("space-y-4", className)}
    >
      <Card>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Score ring */}
          <ScoreRing score={review.score} />

          {/* Info */}
          <div className="flex flex-1 flex-col gap-3 text-center sm:text-left">
            <VerdictBadge verdict={review.verdict} />
            <p className="text-sm text-text-secondary leading-relaxed">{review.summary}</p>
            <StatsBar stats={review.stats} onCategoryClick={onCategoryClick} />
          </div>
        </div>
      </Card>

      {/* Top priority */}
      {review.top_priority && (
        <TopPriority annotation={review.top_priority} onClick={onTopPriorityClick} />
      )}
    </motion.div>
  );
}
