"use client";

import { useEffect, useState } from "react";

export const TerminalModal = ({
  onClose,
}: {
  id: number;
  onClose: () => void;
}) => {
  const [text, setText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);

  const cmdLines = [
    "Microsoft Windows [Version 10.0.19045.3570]",
    "(c) Microsoft Corporation. All rights reserved.",
    "",
    "C:\\Windows\\system32>ipconfig /renew",
    "",
    "Windows IP Configuration",
    "",
    "Ethernet adapter Ethernet 2:",
    "",
    "   Connection-specific DNS Suffix  . : Home",
    "   Link-local IPv6 Address . . . . . : fe80::d1c:1ed0:fd2:41c5%7",
    "   IPv4 Address. . . . . . . . . . . : 192.168.10.2",
    "   Subnet Mask . . . . . . . . . . . : 255.255.255.0",
    "   Default Gateway . . . . . . . . . : 192.168.10.1",
    "",
    "Tunnel adapter isatap.Home:",
    "",
    "   Media State . . . . . . . . . . . : Media disconnected",
    "   Connection-specific DNS Suffix  . : Home",
    "",
    "C:\\Windows\\system32>netstat -an",
    "",
    "Active Connections",
    "",
    "  Proto  Local Address          Foreign Address        State",
    "  TCP    0.0.0.0:135            0.0.0.0:0              LISTENING",
    "  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING",
    "  TCP    192.168.10.2:139       0.0.0.0:0              LISTENING",
    "",
    "C:\\Windows\\system32>dir",
    "",
    " Volume in drive C has no label.",
    " Directory of C:\\Windows\\system32",
    "",
    "12/07/2023  03:14 AM    <DIR>          .",
    "12/07/2023  03:14 AM    <DIR>          ..",
    "11/20/2023  07:32 PM           432,128 kernel32.dll",
    "11/20/2023  07:32 PM         1,310,720 ntdll.dll",
    "",
    "C:\\Windows\\system32>_",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLine < cmdLines.length) {
        const line = cmdLines[currentLine];
        setText((prev) => prev + line + "\n");
        setCurrentLine((prev) => prev + 1);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [currentLine]);

  return (
    <div
      className="fixed bg-black border border-gray-600 shadow-2xl z-50"
      style={{
        left: `${Math.random() * 70}%`,
        top: `${Math.random() * 70}%`,
        width: "600px",
        height: "400px",
        fontFamily: "Consolas, monospace",
      }}
    >
      <div className="flex items-center justify-between bg-gray-800 px-3 py-1 border-b border-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-sm"></div>
          </div>
          <span className="text-white text-sm">
            Administrator: Command Prompt
          </span>
        </div>
        <div className="flex gap-1">
          <button className="w-6 h-6 bg-gray-600 hover:bg-gray-500 text-white text-xs flex items-center justify-center">
            _
          </button>
          <button className="w-6 h-6 bg-gray-600 hover:bg-gray-500 text-white text-xs flex items-center justify-center">
            □
          </button>
          <button
            onClick={onClose}
            className="w-6 h-6 bg-red-600 hover:bg-red-500 text-white text-xs flex items-center justify-center"
          >
            ×
          </button>
        </div>
      </div>
      <div className="p-2 h-full overflow-auto bg-black">
        <pre className="text-white text-sm whitespace-pre-wrap leading-tight">
          {text}
          <span className="animate-pulse bg-white text-black">█</span>
        </pre>
      </div>
    </div>
  );
};
