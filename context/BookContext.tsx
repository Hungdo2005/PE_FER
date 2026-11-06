"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export const BOOK_STATUSES = ["To Read", "Reading", "Finished"] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

const STATUS_PRIORITY: Record<BookStatus, number> = {
  "To Read": 0,
  Reading: 1,
  Finished: 2,
};

const NEXT_STATUS: Partial<Record<BookStatus, BookStatus>> = {
  "To Read": "Reading",
  Reading: "Finished",
};

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  created_at: string;
}

export interface NewBookInput {
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
}

export interface StatusBreakdownItem {
  status: BookStatus;
  count: number;
}

interface BookContextType {
  books: Book[];
  filteredBooks: Book[];
  loadingBooks: boolean;
  filterStatus: string;
  searchQuery: string;
  setFilterStatus: (status: string) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;
  addBook: (input: NewBookInput) => Promise<{ error: string | null }>;
  advanceBookStatus: (id: string) => Promise<{ error: string | null }>;
  deleteBook: (id: string) => Promise<{ error: string | null }>;
  bookCount: number;
  totalPages: number;
  statusBreakdown: StatusBreakdownItem[];
}

const BookContext = createContext<BookContextType | undefined>(undefined);

function sortBooksNewestFirst(list: Book[]): Book[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function BookProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loadingBooks, setLoadingBooks] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const userId = user?.id ?? null;

  useEffect(() => {
    let active = true;

    // Immediately clear previous user's books & filters from memory and screen
    setBooks([]);
    setFilterStatus("");
    setSearchQuery("");

    if (!userId) {
      setLoadingBooks(false);
      return;
    }

    async function loadBooks() {
      setLoadingBooks(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (!error && data) {
        const normalized: Book[] = data.map((row) => ({
          id: String(row.id),
          user_id: String(row.user_id),
          title: String(row.title),
          author: String(row.author),
          pages: Number(row.pages),
          status: row.status as BookStatus,
          created_at: String(row.created_at),
        }));
        setBooks(sortBooksNewestFirst(normalized));
      } else {
        setBooks([]);
      }
      setLoadingBooks(false);
    }

    loadBooks();

    return () => {
      active = false;
    };
  }, [userId]);

  const addBook = useCallback(
    async (input: NewBookInput): Promise<{ error: string | null }> => {
      if (!userId) {
        return { error: "Not authenticated" };
      }

      const { data, error } = await supabase
        .from("books")
        .insert([
          {
            user_id: userId,
            title: input.title,
            author: input.author,
            pages: input.pages,
            status: input.status,
          },
        ])
        .select()
        .single();

      if (error || !data) {
        return { error: error?.message || "Failed to add book" };
      }

      const createdBook: Book = {
        id: String(data.id),
        user_id: String(data.user_id),
        title: String(data.title),
        author: String(data.author),
        pages: Number(data.pages),
        status: data.status as BookStatus,
        created_at: String(data.created_at),
      };

      setBooks((prev) => sortBooksNewestFirst([createdBook, ...prev]));
      return { error: null };
    },
    [userId]
  );

  const advanceBookStatus = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      if (!userId) {
        return { error: "Not authenticated" };
      }

      const target = books.find((b) => b.id === id);
      if (!target) {
        return { error: "Book not found" };
      }

      const nextStatus = NEXT_STATUS[target.status];
      if (!nextStatus) {
        return { error: null };
      }

      const { data, error } = await supabase
        .from("books")
        .update({ status: nextStatus })
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error || !data) {
        return { error: error?.message || "Failed to update status" };
      }

      const updatedStatus = data.status as BookStatus;
      setBooks((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: updatedStatus } : item
        )
      );

      return { error: null };
    },
    [books, userId]
  );

  const deleteBook = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      if (!userId) {
        return { error: "Not authenticated" };
      }

      const { error } = await supabase
        .from("books")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        return { error: error.message };
      }

      setBooks((prev) => prev.filter((item) => item.id !== id));
      return { error: null };
    },
    [userId]
  );

  const clearFilters = useCallback(() => {
    setFilterStatus("");
    setSearchQuery("");
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      const matchStatus = !filterStatus || book.status === filterStatus;
      const matchSearch =
        !normalizedQuery ||
        book.title.toLowerCase().includes(normalizedQuery) ||
        book.author.toLowerCase().includes(normalizedQuery);
      return matchStatus && matchSearch;
    });
  }, [books, filterStatus, searchQuery]);

  const bookCount = filteredBooks.length;

  const totalPages = useMemo(() => {
    return filteredBooks.reduce((sum, book) => sum + Number(book.pages), 0);
  }, [filteredBooks]);

  const statusBreakdown = useMemo(() => {
    const counts = new Map<BookStatus, number>();
    for (const book of filteredBooks) {
      counts.set(book.status, (counts.get(book.status) || 0) + 1);
    }

    return Array.from(counts.entries())
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => {
        if (b.count !== a.count) {
          return b.count - a.count;
        }
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      });
  }, [filteredBooks]);

  return (
    <BookContext.Provider
      value={{
        books,
        filteredBooks,
        loadingBooks,
        filterStatus,
        searchQuery,
        setFilterStatus,
        setSearchQuery,
        clearFilters,
        addBook,
        advanceBookStatus,
        deleteBook,
        bookCount,
        totalPages,
        statusBreakdown,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}

