"use client";

import { motion } from "framer-motion";
import { ArrowDown, FolderOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-surface opacity-80" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Muhammad Junayed
          </h1>
          <p className="text-lg sm:text-xl text-primary font-medium mb-4">
            AI Engineering Enthusiast
          </p>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-8">
            Specializing in Computer Vision, NLP, and Cloud-Native ML Systems.
            Building intelligent solutions at the intersection of research and
            production.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
            >
              <FolderOpen size={18} />
              View Projects
            </a>
            <a
              href="/Muhammad_Junayed_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-surface text-foreground rounded-lg font-medium transition-colors"
            >
              <ArrowDown size={18} />
              Download CV
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a href="#about" className="text-muted hover:text-foreground transition-colors">
            <ArrowDown size={24} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
