import React from "react";
import { BookPlus, CheckCircle2, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    title: "Add books",
    description:
      "Quickly save books with their title, author, page count, and initial reading status.",
    icon: BookPlus,
  },
  {
    title: "Track your progress",
    description:
      "Advance books smoothly from To Read to Reading and Finished, and monitor total pages.",
    icon: CheckCircle2,
  },
  {
    title: "Search your shelf",
    description:
      "Filter by reading status or search instantly across book titles and authors.",
    icon: Search,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-3xl text-center">
        <h1
          data-testid="home-title"
          className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
        >
          ShelfLife
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          A clean and personal book tracker where you keep a list of the books
          you want to read, are currently reading, or have finished, and see how
          much is on your shelf.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="border-slate-200">
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent />
            </Card>
          );
        })}
      </section>
    </div>
  );
}
