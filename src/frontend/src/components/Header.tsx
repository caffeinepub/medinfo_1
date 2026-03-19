import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Cross, Menu, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/search", label: "Search" },
    { to: "/scanner", label: "Scanner" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-teal-700 shadow-header">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" data-ocid="nav.link">
          <div className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center">
            <Cross className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            MedInfo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors hover:underline underline-offset-4"
              activeProps={{
                className: "text-white underline underline-offset-4",
              }}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="bg-white text-teal-700 hover:bg-teal-50 font-semibold rounded-full px-5 shadow-sm"
            data-ocid="nav.button"
          >
            {isLoggingIn
              ? "Signing in..."
              : isAuthenticated
                ? "Sign Out"
                : "Sign In"}
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.toggle"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-teal-800 px-6 pb-4">
          <nav className="flex flex-col gap-3 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-white/80 hover:text-white text-sm font-medium py-2"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.link"
              >
                {link.label}
              </Link>
            ))}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="bg-white text-teal-700 hover:bg-teal-50 font-semibold rounded-full mt-2"
              data-ocid="nav.button"
            >
              {isLoggingIn
                ? "Signing in..."
                : isAuthenticated
                  ? "Sign Out"
                  : "Sign In"}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
