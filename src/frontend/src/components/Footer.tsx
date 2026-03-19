import { Link } from "@tanstack/react-router";
import { Cross } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const utm = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-white border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-teal-700 flex items-center justify-center">
              <Cross className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-teal-700 text-lg">MedInfo</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {[
              { label: "About", to: "/" },
              { label: "Search", to: "/search" },
              { label: "Scanner", to: "/scanner" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-muted-foreground hover:text-teal-700 text-sm transition-colors"
                data-ocid="nav.link"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Social placeholder */}
          <div className="text-sm text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={utm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 hover:underline"
            >
              caffeine.ai
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            <strong>Disclaimer:</strong> MedInfo is for informational purposes
            only. Always consult a qualified healthcare provider before taking
            any medication. Do not use this information for self-diagnosis or
            self-treatment.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            © {year} MedInfo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
