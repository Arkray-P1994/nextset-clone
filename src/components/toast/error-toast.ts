import type React from "react";
import { toast } from "sonner";

export const showErrorToast = (message: string) =>
  toast.error(message, {
    duration: 2000,
    position: "top-right",
    style: {
      border: "1px solid rgba(239, 68, 68, 0.5)", // red-500/50
      color: "rgb(220, 38, 38)", // red-600
      backgroundColor: "#fff", // white background
      borderRadius: "0.375rem", // rounded-md
      padding: "0.75rem 1rem", // px-4 py-3
      fontSize: "0.875rem", // text-sm
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    } as React.CSSProperties,
  });
