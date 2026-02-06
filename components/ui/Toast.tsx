"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/cn";

export type ToastType = "success" | "error" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
}

const toastConfig: Record<ToastType, { icon: React.ElementType; className: string }> = {
  success: { icon: CheckCircle, className: "border-praise/30 text-praise" },
  error: { icon: AlertCircle, className: "border-bug/30 text-bug" },
  info: { icon: Info, className: "border-accent/30 text-accent" },
};

export function Toast({ message, type = "success", visible, onDismiss, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  const config = toastConfig[type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border bg-bg-card px-4 py-3 shadow-lg shadow-black/30",
            config.className
          )}
          role="alert"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="text-sm text-text-primary">{message}</span>
          <button
            onClick={onDismiss}
            className="ml-2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
