"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "mdjunayed573@gmail.com",
    href: "mailto:mdjunayed573@gmail.com",
    isLucide: true,
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "MD-Junayed000",
    href: "https://github.com/MD-Junayed000",
    isLucide: false,
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "muhammad-junayed-ete20",
    href: "https://www.linkedin.com/in/muhammad-junayed-ete20/",
    isLucide: false,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center">
            Get in Touch
          </h2>
          <p className="text-muted text-center mb-12 max-w-md mx-auto">
            Open to collaboration, research opportunities, and interesting
            projects.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {contacts.map((contact) => (
              <a
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface border border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors group"
              >
                <div className="text-primary mx-auto mb-3 flex justify-center">
                  {contact.isLucide ? (
                    <contact.icon size={24} />
                  ) : (
                    <contact.icon size={24} />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {contact.label}
                </h3>
                <p className="text-xs text-muted group-hover:text-foreground transition-colors">
                  {contact.value}
                </p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
