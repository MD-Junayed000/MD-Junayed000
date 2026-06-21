"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import api from "@/lib/api";
import type { Certificate } from "@/types";

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    api
      .get("/api/certificates")
      .then((res) => setCertificates(res.data))
      .catch(() => {});
  }, []);

  return (
    <section id="certificates" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            Certificates
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-surface border border-border rounded-lg p-5 hover:border-primary/50 transition-colors"
              >
                <Award size={20} className="text-primary mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {cert.name}
                </h3>
                <p className="text-xs text-muted mb-2">{cert.issuer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{cert.date}</span>
                  {cert.file_path && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${cert.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-foreground transition-colors"
                      aria-label="View certificate"
                    >
                      <ExternalLink size={14} />
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
