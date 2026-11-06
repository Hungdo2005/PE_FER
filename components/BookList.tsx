"use client";

import React from "react";
import { type BookStatus, useBooks } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function getStatusBadgeClass(status: BookStatus): string {
  switch (status) {
    case "To Read":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Reading":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Finished":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }
}

export function BookList() {
  const { filteredBooks, advanceBookStatus, deleteBook } = useBooks();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">My Shelf</CardTitle>
        <CardDescription>Most recently added first</CardDescription>
      </CardHeader>
      <CardContent>
        {filteredBooks.length === 0 ? (
          <div
            data-testid="books-empty"
            className="rounded-lg border border-dashed py-10 text-center text-sm font-medium text-slate-500"
          >
            No books found
          </div>
        ) : (
          <div data-testid="book-list" className="space-y-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                data-testid="book-item"
                className="flex flex-col justify-between gap-3 rounded-lg border p-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      data-testid="book-title"
                      className="break-words text-base font-semibold text-slate-900"
                    >
                      {book.title}
                    </h4>
                    <span
                      data-testid="book-status"
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadgeClass(
                        book.status
                      )}`}
                    >
                      {book.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                    <span data-testid="book-author" className="break-words">
                      {book.author}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span
                      data-testid="book-pages"
                      className="text-xs font-medium text-slate-500"
                    >
                      {book.pages} pages
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
                  {book.status !== "Finished" && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      data-testid="btn-advance-status"
                      onClick={() => advanceBookStatus(book.id)}
                    >
                      {book.status === "To Read"
                        ? "Start Reading"
                        : "Mark Finished"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    data-testid="btn-delete-book"
                    onClick={() => deleteBook(book.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

