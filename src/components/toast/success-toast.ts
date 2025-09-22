// src/lib/toasts.ts
import { toast } from "sonner";

export const showSuccessToast = (message: string) =>
  toast.success(message, {
    duration: 2000,
    position: "top-right",
    style: {
      border: "1px solid rgba(16, 185, 129, 0.5)", // emerald-500/50
      color: "rgb(5, 150, 105)", // emerald-600
      backgroundColor: "#fff", // or keep transparent if preferred
      borderRadius: "0.375rem", // rounded-md
      padding: "0.75rem 1rem", // px-4 py-3
      fontSize: "0.875rem", // text-sm
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    } as React.CSSProperties,
  });
