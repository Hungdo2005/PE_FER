"use client";

import React from "react";
import { BOOK_STATUSES, useBooks } from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

export function BookFilters() {
  const {
    filterStatus,
    searchQuery,
    setFilterStatus,
    setSearchQuery,
    clearFilters,
  } = useBooks();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-end">
          <div className="space-y-1.5 sm:col-span-4">
            <Label htmlFor="filter-status">Status</Label>
            <NativeSelect
              id="filter-status"
              data-testid="filter-status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All</option>
              {BOOK_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </NativeSelect>
          </div>

          <div className="space-y-1.5 sm:col-span-5">
            <Label htmlFor="search-input">Search</Label>
            <Input
              id="search-input"
              data-testid="search-input"
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sm:col-span-3">
            <Button
              type="button"
              variant="outline"
              data-testid="btn-clear-filters"
              onClick={clearFilters}
              className="w-full"
            >
              Clear
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

