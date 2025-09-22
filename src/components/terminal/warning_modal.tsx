"use client";

import { X, AlertTriangle, Clock } from "lucide-react";

interface RedModalProps {
  timeLeft: number;
  closeAttempts: number;
  onCloseAttempt: () => void;
}

export default function RedModal({
  timeLeft,
  closeAttempts,
  onCloseAttempt,
}: RedModalProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-red-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-red-600 border-4 border-red-400 rounded-lg shadow-2xl max-w-md w-full relative animate-pulse">
        {/* Fake close button that punishes users */}
        <button
          onClick={onCloseAttempt}
          className="absolute -top-2 -right-2 bg-red-800 hover:bg-red-900 text-white rounded-full p-2 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 text-center text-white">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-200" />
          <h2 className="text-2xl font-bold mb-4">GOTCHA!</h2>
          <p className="text-red-100 mb-6">
            You've been hacked! This modal cannot be closed... well, technically
            it can, but every time you try, you lose 1 minute from the
            countdown!. We will leak your company data to darkweb if you failed
            to pay us before the countdown ends, just contact hacker@gmail.com
            for more details
          </p>

          <div className="bg-red-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-bold">Time Remaining:</span>
            </div>
            <div className="text-3xl font-mono font-bold text-red-200">
              {formatTime(timeLeft)}
            </div>
          </div>

          {closeAttempts > 0 && (
            <div className="bg-red-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-200">
                Close attempts:{" "}
                <span className="font-bold">{closeAttempts}</span>
              </p>
              <p className="text-xs text-red-300 mt-1">
                Each attempt costs you 1 minute!
              </p>
            </div>
          )}

          <p className="text-xs text-red-200">
            {timeLeft <= 0
              ? "Time's up! Prepare for the hacker sequence..."
              : "Wait for the countdown to finish, or keep clicking that X button if you dare!"}
          </p>

          {closeAttempts >= 3 && (
            <div className="mt-4 p-3 bg-red-800 rounded-lg">
              <p className="text-sm text-red-200 font-bold">
                Seriously? {closeAttempts} attempts?
              </p>
              <p className="text-xs text-red-300">
                You're making this worse for yourself!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
