"use client";

import { useState } from "react";

export default function ChatbotButton() {
  const [open] = useState(false);

  return (
    <button
      onClick={() => alert("Chatbot coming soon 🤖")}
      aria-label="Open chatbot"
      title="Open chatbot"
      className={
        "fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-xl " +
        "bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:scale-105 transform-gpu transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 dark:from-gray-800 dark:to-gray-700"
      }
    >
      <svg
        className="w-7 h-7"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M21 15a2 2 0 01-2 2H8l-5 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 10h.01M11 10h.01M15 10h.01"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* subtle unread badge */}
      <span className="absolute top-3 right-3 inline-flex h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />

      {/* optional open indicator (kept for future use) */}
      {open ? <span className="sr-only">Chat open</span> : null}
    </button>
  );
}
