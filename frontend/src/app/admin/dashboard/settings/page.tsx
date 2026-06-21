"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminSettings() {
  const [modelId, setModelId] = useState(
    "mistralai/Mistral-7B-Instruct-v0.3"
  );
  const [apiToken, setApiToken] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/admin/settings", {
        hf_model_id: modelId,
        hf_api_token: apiToken || undefined,
      });
      toast.success("Settings saved");
      setApiToken("");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <form onSubmit={handleSave} className="max-w-xl space-y-6">
        <div className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            HuggingFace Configuration
          </h2>
          <p className="text-sm text-muted">
            Configure the language model used by the chatbot for generating
            responses.
          </p>

          <div>
            <label
              htmlFor="modelId"
              className="block text-sm text-muted mb-1"
            >
              Model ID
            </label>
            <input
              id="modelId"
              type="text"
              value={modelId}
              onChange={(e) => setModelId(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="mistralai/Mistral-7B-Instruct-v0.3"
            />
          </div>

          <div>
            <label
              htmlFor="apiToken"
              className="block text-sm text-muted mb-1"
            >
              API Token (leave blank to keep existing)
            </label>
            <input
              id="apiToken"
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
              placeholder="hf_..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Settings
        </button>
      </form>
    </div>
  );
}
