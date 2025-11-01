"use client";

import React, { useState } from "react";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, from: "Sandra 🐈", text: "Oi! Vamos marcar um passeio?" },
    { id: 2, from: "Douglas 🐕", text: "Claro! Domingo no parque?" },
  ]);

  return (
    <div className="flex flex-col p-4 gap-3">
      <h1 className="text-lg font-semibold">Mensagens 💬</h1>
      {messages.map((m) => (
        <div
          key={m.id}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <strong>{m.from}:</strong> {m.text}
        </div>
      ))}
    </div>
  );
}
