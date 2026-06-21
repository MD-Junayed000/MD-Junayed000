"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, BookOpen, Target } from "lucide-react";
import api from "@/lib/api";
import type { About as AboutType } from "@/types";

export default function About() {
  const [about, setAbout] = useState<AboutType | null>(null);

  useEffect(() => {
    api
      .get("/api/about")
      .then((res) => setAbout(res.data))
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">
            About Me
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-surface border border-border rounded-lg p-6">
              <User size={24} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {about?.title || "AI Engineering Enthusiast"}
              </h3>
              <p className="text-sm text-muted">
                {about?.bio ||
                  "Passionate about building intelligent systems that bridge cutting-edge research with real-world applications."}
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <BookOpen size={24} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Education
              </h3>
              <p className="text-sm text-muted">
                Final-year student in Electronics and Telecommunication
                Engineering (ETE) at Chittagong University of Engineering and
                Technology (CUET).
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <Target size={24} className="text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Focus Areas
              </h3>
              <p className="text-sm text-muted">
                Computer Vision, Natural Language Processing, RAG pipelines,
                MLOps, and Cloud-Native ML Systems.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
