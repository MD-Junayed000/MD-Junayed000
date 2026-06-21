import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

export default function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            &copy; {new Date().getFullYear()} Muhammad Junayed. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/MD-Junayed000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <GithubIcon size={18} />
            </a>
            <a
              href="https://www.linkedin.com/in/muhammad-junayed-ete20/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
            <a
              href="mailto:mdjunayed573@gmail.com"
              className="text-muted hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
            <a
              href="https://www.kaggle.com/muhammedjunayed"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors text-sm font-medium"
              aria-label="Kaggle"
            >
              K
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
