"use client";

import { useEffect, useState } from "react";
import { FolderOpen, BarChart3, FileText, Award } from "lucide-react";
import api from "@/lib/api";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    research: 0,
    certificates: 0,
  });

  useEffect(() => {
    Promise.all([
      api.get("/api/projects").catch(() => ({ data: [] })),
      api.get("/api/skills").catch(() => ({ data: [] })),
      api.get("/api/research").catch(() => ({ data: [] })),
      api.get("/api/certificates").catch(() => ({ data: [] })),
    ]).then(([projects, skills, research, certificates]) => {
      setStats({
        projects: projects.data.length,
        skills: skills.data.length,
        research: research.data.length,
        certificates: certificates.data.length,
      });
    });
  }, []);

  const cards = [
    { label: "Projects", count: stats.projects, icon: FolderOpen },
    { label: "Skills", count: stats.skills, icon: BarChart3 },
    { label: "Research", count: stats.research, icon: FileText },
    { label: "Certificates", count: stats.certificates, icon: Award },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface border border-border rounded-lg p-5"
          >
            <card.icon size={20} className="text-primary mb-2" />
            <p className="text-2xl font-bold text-foreground">{card.count}</p>
            <p className="text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
