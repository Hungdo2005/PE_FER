"use client";

import React from "react";
import { useBooks } from "@/context/BookContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BookSummary() {
  const { bookCount, totalPages, statusBreakdown } = useBooks();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Shelf Summary</CardTitle>
        <CardDescription>Overview of currently shown books</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
          <div>
            <p className="text-xs text-slate-500">Books Shown</p>
            <p
              data-testid="book-count"
              className="text-xl font-bold text-slate-900"
            >
              {bookCount}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total Pages</p>
            <p
              data-testid="total-pages"
              className="text-xl font-bold text-slate-900"
            >
              {totalPages}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            By Status
          </p>
          <div data-testid="status-breakdown" className="space-y-1.5">
            {statusBreakdown.map((item) => (
              <div
                key={item.status}
                data-testid="breakdown-row"
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span
                  data-testid="breakdown-name"
                  className="font-medium text-slate-700"
                >
                  {item.status}
                </span>
                <span
                  data-testid="breakdown-count"
                  className="font-semibold text-slate-900"
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

