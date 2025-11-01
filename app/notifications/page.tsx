"use client";

import React, { useState } from "react";

export default function NotificationsPage() {
  const [notifications] = useState([
    { id: 1, text: "Sandra curtiu a foto de Bruce 🐕" },
    { id: 2, text: "Nova mensagem de Marcos 🐾" },
  ]);

  return (
    <div className="p-4">
      <h1 className="text-lg font-semibold mb-3">Notificações 🔔</h1>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {n.text}
          </div>
        ))}
      </div>
    </div>
  );
}
