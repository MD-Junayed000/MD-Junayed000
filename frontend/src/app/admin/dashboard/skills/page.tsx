"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import type { Skill } from "@/types";

interface SkillForm {
  category: string;
  name: string;
  proficiency: number;
}

const emptyForm: SkillForm = { category: "", name: "", proficiency: 75 };

export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SkillForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchSkills = () => {
    api
      .get("/api/skills")
      .then((res) => setSkills(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/api/admin/skills/${editingId}`, form);
        toast.success("Skill updated");
      } else {
        await api.post("/api/admin/skills", form);
        toast.success("Skill created");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      fetchSkills();
    } catch {
      toast.error("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (skill: Skill) => {
    setForm({
      category: skill.category,
      name: skill.name,
      proficiency: skill.proficiency,
    });
    setEditingId(skill.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/api/admin/skills/${id}`);
      toast.success("Skill deleted");
      fetchSkills();
    } catch {
      toast.error("Delete failed");
    }
  };

  // Group by category
  const grouped = skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );

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
        <h1 className="text-2xl font-bold text-foreground">Skills</h1>
        <button
          onClick={() => {
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add Skill
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? "Edit Skill" : "New Skill"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="e.g. AI/ML"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                  placeholder="e.g. PyTorch"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-1">
                  Proficiency (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.proficiency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      proficiency: parseInt(e.target.value) || 0,
                    })
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

      <div className="space-y-6">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              {category}
            </h3>
            <div className="space-y-2">
              {items.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-surface border border-border rounded-lg p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-foreground">{skill.name}</span>
                    <span className="text-xs text-muted">
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-1.5 text-muted hover:text-foreground transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-1.5 text-muted hover:text-red-400 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
