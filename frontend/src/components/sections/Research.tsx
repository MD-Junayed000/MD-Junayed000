"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";
import api from "@/lib/api";
import type { Research as ResearchType } from "@/types";

export default function Research() {
  const [research, setResearch] = useState<ResearchType[]>([]);

  useEffect(() => {
    api
      .get("/api/research")
      .then((res) => setResearch(res.data))
      .catch(() => {});
  }, []);

  return (
    <section id="research" className="py-20 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Research
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {research.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-surface border border-border rounded-lg p-5 flex items-start gap-4"
              >
                <FileText
                  size={20}
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    {item.venue && <span>{item.venue}</span>}
                    {item.year && <span>{item.year}</span>}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        item.status === "Published"
                          ? "bg-green-900/30 text-green-400"
                          : "bg-blue-900/30 text-blue-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground transition-colors flex-shrink-0"
                    aria-label="View paper"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
