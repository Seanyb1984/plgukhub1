"use client";

import { useState } from "react";
import { FolderPlus, Loader2, ExternalLink } from "lucide-react";

export default function DriveFolderButton({ clientId, clientName }: { clientId: string, clientName: string }) {
  const [loading, setLoading] = useState(false);
  const [folderUrl, setFolderUrl] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/integrations/google-drive/create-folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientName }),
      });
      const data = await response.json();
      if (data.url) setFolderUrl(data.url);
    } catch (error) {
      console.error("Drive Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (folderUrl) {
    return (
      <a href={folderUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-green-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-green-700 transition-all">
        <ExternalLink className="w-5 h-5" /> Open Vault
      </a>
    );
  }

  return (
    <button 
      onClick={handleCreate}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FolderPlus className="w-5 h-5" />}
      {loading ? "Creating..." : "Create Clinical Vault"}
    </button>
  );
}
