import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1b2a] text-gray-900 dark:text-gray-100">
      {children}
    </div>
  );
}
