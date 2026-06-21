"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminAbout() {
  const [bio, setBio] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/api/about")
      .then((res) => {
        setBio(res.data.bio || "");
        setTitle(res.data.title || "");
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/api/admin/about", { bio, title });
      toast.success("About updated");
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/api/admin/upload-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Edit About</h1>

      <form onSubmit={handleSave} className="max-w-2xl space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm text-muted mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            placeholder="Your professional title"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm text-muted mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={6}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
            placeholder="Write about yourself..."
          />
        </div>

        <div>
          <label htmlFor="photo" className="block text-sm text-muted mb-1">
            Profile Photo
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="text-sm text-muted file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-surface file:text-foreground hover:file:bg-surface-hover"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
