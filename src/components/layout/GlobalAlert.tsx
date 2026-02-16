"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function GlobalAlert() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"success" | "error">("success");

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success) {
      setMessage(success);
      setType("success");
      setVisible(true);
    } else if (error) {
      setMessage(error);
      setType("error");
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${
      type === "success" ? "bg-green-600" : "bg-red-600"
    }`}>
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button 
          onClick={() => setVisible(false)}
          className="hover:bg-white/20 p-1 rounded"
        >
          ✕
        </button>
      </div>
    </div>
  );
}