"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Research } from "@/types";

interface ResearchForm {
  title: string;
  venue: string;
  year: number | string;
  status: string;
  link: string;
}

const emptyForm: ResearchForm = {
  title: "",
  venue: "",
  year: new Date().getFullYear(),
  status: "Ongoing",
  link: "",
};

export default function AdminResearch() {
  const [research, setResearch] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ResearchForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchResearch = () => {
    api
      .get("/api/research")
      .then((res) => setResearch(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchResearch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      year: form.year ? Number(form.year) : null,
    };
    try {
      if (editingId) {
        await api.put(`/api/admin/research/${editingId}`, payload);
        toast.success("Research updated");
      } else {
        await api.post("/api/admin/research", payload);
        toast.success("Research created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchResearch();
    } catch {
      toast.error("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: Research) => {
    setForm({
      title: item.title,
      venue: item.venue || "",
      year: item.year || "",
      status: item.status,
      link: item.link || "",
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this publication?")) return;
    try {
      await api.delete(`/api/admin/research/${id}`);
      toast.success("Research deleted");
      fetchResearch();
    } catch {
      toast.error("Delete failed");
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Research</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Publication
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit Publication" : "New Publication"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Venue</label>
                <input
                  type="text"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="e.g. IEEE Conference"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Year</label>
                <input
                  type="number"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="Ongoing">Ongoing</option>
                  <option value="Published">Published</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Link</label>
              <input
                type="url"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder="https://"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {editingId ? "Update" : "Create"}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {research.map((item) => (
          <div
            key={item.id}
            className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs text-muted mt-1">
                {item.venue && `${item.venue} `}
                {item.year && `(${item.year})`} - {item.status}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-muted hover:text-red-400 transition-colors"
                aria-label="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
