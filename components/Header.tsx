"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 text-base font-bold text-slate-900 hover:opacity-90 sm:gap-2 sm:text-lg"
        >
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span>ShelfLife</span>
        </Link>

        {!loading && (
          <nav className="flex min-w-0 items-center gap-1.5 sm:gap-3">
            {user ? (
              <>
                <span
                  data-testid="user-email"
                  className="max-w-[95px] truncate text-xs text-slate-600 sm:max-w-[240px] sm:text-sm"
                >
                  {user.email}
                </span>
                <Button asChild variant="ghost" size="sm" className="px-2.5 sm:px-3">
                  <Link href="/books" data-testid="link-books">
                    Books
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  data-testid="btn-logout"
                  className="px-2.5 sm:px-3"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login" data-testid="btn-login">
                    Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/register" data-testid="btn-register">
                    Register
                  </Link>
                </Button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
