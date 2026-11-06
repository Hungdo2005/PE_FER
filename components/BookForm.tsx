"use client";

import React, { useState } from "react";
import {
  BOOK_STATUSES,
  type BookStatus,
  useBooks,
} from "@/context/BookContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select";

interface BookFormErrors {
  title?: string;
  author?: string;
  pages?: string;
  status?: string;
}

function validateBookFields(
  title: string,
  author: string,
  pages: string,
  status: string
): BookFormErrors {
  const errors: BookFormErrors = {};

  if (!title.trim()) {
    errors.title = "Title is required";
  } else if (title.length > 80) {
    errors.title = "Title must be at most 80 characters";
  }

  if (!author.trim()) {
    errors.author = "Author is required";
  } else if (author.length > 60) {
    errors.author = "Author must be at most 60 characters";
  }

  const trimmedPages = pages.trim();
  if (!trimmedPages) {
    errors.pages = "Pages is required";
  } else {
    const parsed = Number(trimmedPages);
    if (
      !/^-?\d+$/.test(trimmedPages) ||
      !Number.isInteger(parsed) ||
      parsed < 1 ||
      parsed > 5000
    ) {
      errors.pages = "Pages must be a whole number between 1 and 5000";
    }
  }

  if (!status) {
    errors.status = "Please choose a status";
  }

  return errors;
}

export function BookForm() {
  const { addBook } = useBooks();

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [pages, setPages] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const errors = submitted
    ? validateBookFields(title, author, pages, status)
    : {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    setSuccessMessage(null);

    const validationErrors = validateBookFields(title, author, pages, status);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    const { error } = await addBook({
      title: title.trim(),
      author: author.trim(),
      pages: Number(pages.trim()),
      status: status as BookStatus,
    });
    setSubmitting(false);

    if (error) {
      setServerError(error);
      return;
    }

    setTitle("");
    setAuthor("");
    setPages("");
    setStatus("");
    setSubmitted(false);
    setSuccessMessage("Book added");
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Add a Book</CardTitle>
        <CardDescription>Add a new book to your personal shelf</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          data-testid="book-form"
          noValidate
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="input-title">Title</Label>
            <Input
              id="input-title"
              data-testid="input-title"
              type="text"
              placeholder="Book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && (
              <p
                data-testid="error-title"
                className="text-xs font-medium text-red-600"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-author">Author</Label>
            <Input
              id="input-author"
              data-testid="input-author"
              type="text"
              placeholder="Book author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            {errors.author && (
              <p
                data-testid="error-author"
                className="text-xs font-medium text-red-600"
              >
                {errors.author}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-pages">Pages</Label>
            <Input
              id="input-pages"
              data-testid="input-pages"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 320"
              value={pages}
              onChange={(e) => setPages(e.target.value)}
            />
            {errors.pages && (
              <p
                data-testid="error-pages"
                className="text-xs font-medium text-red-600"
              >
                {errors.pages}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="select-status">Status</Label>
            <NativeSelect
              id="select-status"
              data-testid="select-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Choose status</option>
              {BOOK_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </NativeSelect>
            {errors.status && (
              <p
                data-testid="error-status"
                className="text-xs font-medium text-red-600"
              >
                {errors.status}
              </p>
            )}
          </div>

          {serverError && (
            <p
              data-testid="error-book"
              className="rounded-md bg-red-50 p-2.5 text-xs font-medium text-red-600"
            >
              {serverError}
            </p>
          )}

          {successMessage && (
            <p
              data-testid="book-success"
              className="rounded-md bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700"
            >
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            data-testid="btn-add-book"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

