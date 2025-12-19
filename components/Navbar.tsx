"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Inventory" },
  { href: "/sales", label: "Sales" },
  { href: "/purchase", label: "Purchase" },
  { href: "/reports", label: "Reports" },
];

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-200 hover:bg-gray-800 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (
        saved === "dark" ||
        (!saved &&
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        setTheme("dark");
      } else {
        document.documentElement.classList.remove("dark");
        setTheme("light");
      }
    } catch (e) {
      // safe fallback
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      if (next === "dark") document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", next);
    } catch (e) {
      // ignore
    }
  }

  return (
    <header className="w-full bg-gray-900 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                SI
              </div>
              <span className="font-semibold text-lg">Smart Inventory</span>
            </Link>
          </div>

          {/* Center: Nav (desktop) */}
          <nav className="hidden md:flex md:space-x-1">
            {navItems.map((it) => (
              <NavLink
                key={it.href}
                href={it.href}
                label={it.label}
                active={pathname === it.href}
              />
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* simple search - desktop only */}
            <div className="hidden md:flex items-center bg-gray-800 rounded-md px-2">
              <label htmlFor="nav-search" className="sr-only">
                Search
              </label>
              <input
                id="nav-search"
                placeholder="Search items"
                className="bg-transparent px-2 py-1 text-sm text-gray-200 placeholder-gray-400 focus:outline-none"
              />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-pressed={theme === "dark"}
              aria-label="Toggle dark mode"
              className="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              {theme === "dark" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM15.657 4.343a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM18 10a1 1 0 110 2h-1a1 1 0 110-2h1zM15.657 15.657a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.343 15.657a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM3 10a1 1 0 110-2H2a1 1 0 110 2h1zM4.343 4.343a1 1 0 011.414 0l.707.707A1 1 0 115.05 6.464l-.707-.707a1 1 0 010-1.414z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M17.293 13.293A8 8 0 116.707 2.707a7 7 0 0010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Notification (UI only) */}
            <button
              aria-label="Notifications"
              className="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-200"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 000 2v1l-.8 1.6A1 1 0 005 13h10a1 1 0 00.8-1.4L15 10V9a1 1 0 000-2h-1V6a4 4 0 00-4-4z" />
              </svg>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((s) => !s)}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              >
                <img
                  src="/avatar_logo.png"
                  alt="User"
                  className="h-8 w-8 rounded-full object-cover bg-gray-700"
                />
                <span className="hidden sm:inline text-sm text-gray-200">
                  Admin
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileOpen((s) => !s)}
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                className="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {mobileOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-gray-900 border-t border-gray-800"
        >
          <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">
            {navItems.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === it.href
                    ? "bg-gray-800 text-white"
                    : "text-gray-200 hover:bg-gray-800"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {it.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                href="#"
                className="block px-3 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-md"
              >
                Profile
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
