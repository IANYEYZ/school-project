// components/Navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: "/", label: "仪表盘" },
    { href: "/ranks", label: "排名" },
    { href: "/export", label: "导出 CSV" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm fixed w-full z-10 top-0 left-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand / Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-semibold text-blue-600">
              CYEZ - 班级卫生评分
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:space-x-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-gray-700 hover:text-blue-600 px-2 py-1 rounded ${
                  pathname === l.href ? "font-semibold text-blue-600" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <span className="text-gray-700 px-2 py-1 text-sm">
                  {session.user?.username}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                >
                  登出
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-700 hover:text-blue-600 px-2 py-1 rounded"
              >
                登录
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block text-gray-700 hover:text-blue-600 px-2 py-1 rounded ${
                  pathname === l.href ? "font-semibold text-blue-600" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {session ? (
              <>
                <div className="text-gray-700 px-2 py-1 text-sm">
                  {session.user?.username}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                >
                  登出
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block text-gray-700 hover:text-blue-600 px-2 py-1 rounded"
                onClick={() => setOpen(false)}
              >
                登录
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
