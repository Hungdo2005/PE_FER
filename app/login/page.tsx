"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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

interface LoginErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

export default function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const errors = submitted ? validateLogin(email, password) : {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError(null);

    const validationErrors = validateLogin(email, password);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setAuthError(error);
      return;
    }

    router.push("/books");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Sign in to your ShelfLife account to manage your books
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid="login-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                data-testid="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-red-600"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                data-testid="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-red-600"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {authError && (
              <p
                data-testid="error-auth"
                className="rounded-md bg-red-50 p-2.5 text-xs font-medium text-red-600"
              >
                {authError}
              </p>
            )}

            <Button
              type="submit"
              data-testid="login-submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
