"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import api from "@/lib/api";
import type { Project } from "@/types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    api
      .get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch(() => {});
  }, []);

  const allTechs = Array.from(
    new Set(
      projects.flatMap((p) =>
        p.tech_stack.split(",").map((t) => t.trim())
      )
    )
  ).slice(0, 8);

  const categories = ["All", ...allTechs];

  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) =>
          p.tech_stack.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <section id="projects" className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Projects
          </h2>

          {/* Filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                  filter === cat
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted hover:text-foreground hover:border-muted"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Project grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-surface border border-border rounded-lg p-6 hover:border-primary/50 transition-colors group"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-muted mb-4 line-clamp-3">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tech_stack.split(",").map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-xs bg-background border border-border rounded text-muted"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-foreground transition-colors"
                      aria-label="GitHub repository"
                    >
                      <GithubIcon size={16} />
                    </a>
                  )}
                  {project.demo_url && (
                    <a
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-foreground transition-colors"
                      aria-label="Live demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
