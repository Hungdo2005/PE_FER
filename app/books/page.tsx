"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BookForm } from "@/components/BookForm";
import { BookSummary } from "@/components/BookSummary";
import { BookFilters } from "@/components/BookFilters";
import { BookList } from "@/components/BookList";

export default function BooksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Prevent Flash of Content while checking auth or redirecting unauthenticated user
  if (loading || !user) {
    return null;
  }

  return (
    <div
      data-testid="books-page"
      className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          My Books
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Add books to your shelf, filter or search your collection, and track
          your reading progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-4">
          <BookForm />
          <BookSummary />
        </div>

        <div className="space-y-6 lg:col-span-8">
          <BookFilters />
          <BookList />
        </div>
      </div>
    </div>
  );
}

