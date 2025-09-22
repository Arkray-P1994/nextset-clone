"use client";

import { useEffect, useRef, useState } from "react";

const LOCAL_KEY = "bsod-progress";

export const BSOD = () => {
  // initialize from localStorage (client-only)
  const [progress, setProgress] = useState<number>(() => {
    try {
      const saved =
        typeof window !== "undefined" ? localStorage.getItem(LOCAL_KEY) : null;
      return saved !== null ? Number(saved) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // keep a ref to the latest value to avoid closure-stale issues (optional here but nice)
  const progressRef = useRef(progress);
  progressRef.current = progress;

  useEffect(() => {
    const interval = setInterval(() => {
      // increment without a cap (counting to infinity)
      setProgress((prev) => {
        const next = prev + 1;
        try {
          localStorage.setItem(LOCAL_KEY, String(next));
        } catch {
          // ignore localStorage errors (private mode, etc.)
        }
        return next;
      });
    }, 2000); // ~1% every 2s, same as before

    return () => clearInterval(interval);
  }, []);

  // optional: keep localStorage in sync if something else changes it
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, String(progress));
    } catch {}
  }, [progress]);

  return (
    <div className="fixed inset-0 z-[9999] bg-blue-600 flex flex-col items-start justify-center text-white font-sans">
      <div className="text-start max-w-4xl px-8">
        <div>
          <div className="mb-8">
            <div className="text-8xl mb-4">:(</div>
          </div>

          <div className="text-3xl mb-8 leading-relaxed">
            Your PC ran into a problem and needs to restart. We're just
            collecting some error info, and then we'll restart for you.
          </div>
        </div>

        <div className="text-xl mb-12">
          {progress.toLocaleString()}% complete
        </div>

        <div className="flex items-start gap-4 text-left">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-white animate-pulse"
                  style={{
                    animationDelay: `${i * 150}ms`, // stagger blinking
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="text-sm">
            <p className="mb-2  font-bold">
              For more information about this issue and possible fixes, contact
              hacker@gmail.com
            </p>
            <p className="mb-2">
              If you call a support person, give them this info:
            </p>
            <p>Stop code: HACKED_123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
