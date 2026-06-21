"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Project } from "@/types";

interface ProjectForm {
  name: string;
  description: string;
  tech_stack: string;
  repo_url: string;
  demo_url: string;
  order: number;
}

const emptyForm: ProjectForm = {
  name: "",
  description: "",
  tech_stack: "",
  repo_url: "",
  demo_url: "",
  order: 0,
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProjects = () => {
    api
      .get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/admin/projects/${editingId}`, form);
        toast.success("Project updated");
      } else {
        await api.post("/api/admin/projects", form);
        toast.success("Project created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchProjects();
    } catch {
      toast.error("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      name: project.name,
      description: project.description,
      tech_stack: project.tech_stack,
      repo_url: project.repo_url || "",
      demo_url: project.demo_url || "",
      order: project.order,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    try {
      await api.delete(`/api/admin/projects/${id}`);
      toast.success("Project deleted");
      fetchProjects();
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
        <h1 className="text-2xl font-bold text-foreground">Projects</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="mb-6 bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit Project" : "New Project"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.tech_stack}
                  onChange={(e) =>
                    setForm({ ...form, tech_stack: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">
                  Repo URL
                </label>
                <input
                  type="url"
                  value={form.repo_url}
                  onChange={(e) =>
                    setForm({ ...form, repo_url: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Demo URL
                </label>
                <input
                  type="url"
                  value={form.demo_url}
                  onChange={(e) =>
                    setForm({ ...form, demo_url: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Order</label>
                <input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm({ ...form, order: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
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

      {/* Project list */}
      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-surface border border-border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {project.name}
              </h3>
              <p className="text-xs text-muted mt-1">{project.tech_stack}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEdit(project)}
                className="p-2 text-muted hover:text-foreground transition-colors"
                aria-label="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
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
