import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BookProvider } from "@/context/BookContext";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "ShelfLife - Personal Reading Tracker",
  description:
    "Keep a list of the books you want to read, are reading or have finished.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <AuthProvider>
          <BookProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
            </div>
          </BookProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
