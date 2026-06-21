"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAuthenticated, removeToken } from "@/lib/auth";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  BarChart3,
  FileText,
  Award,
  FileUp,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const sidebarLinks = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/about", icon: User, label: "About" },
  { href: "/admin/dashboard/projects", icon: FolderOpen, label: "Projects" },
  { href: "/admin/dashboard/skills", icon: BarChart3, label: "Skills" },
  { href: "/admin/dashboard/research", icon: FileText, label: "Research" },
  { href: "/admin/dashboard/certificates", icon: Award, label: "Certificates" },
  { href: "/admin/dashboard/documents", icon: FileUp, label: "Documents" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/admin");
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-surface border-r border-border flex flex-col transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            Admin Panel
          </h2>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-lg transition-colors"
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-muted hover:text-red-400 w-full rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-muted hover:text-foreground"
            aria-label="Open menu"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm font-medium text-foreground">
            Admin Panel
          </span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
