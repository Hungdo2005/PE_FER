"use client";

import React, { useState } from "react";
import Link from "next/link";
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

interface RegisterErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegister(
  email: string,
  password: string,
  confirmPassword: string
): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export default function RegisterPage() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const errors = submitted
    ? validateRegister(email, password, confirmPassword)
    : {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setAuthError(null);
    setSuccessMessage(null);

    const validationErrors = validateRegister(email, password, confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    const { error } = await signUp(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setAuthError(error);
      return;
    }

    setSuccessMessage("Registration successful");
    setSubmitted(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>
            Create a new ShelfLife account to track your reading list
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid="register-form"
            noValidate
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                data-testid="register-email"
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
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                data-testid="register-password"
                type="password"
                placeholder="At least 6 characters"
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

            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">
                Confirm Password
              </Label>
              <Input
                id="register-confirm-password"
                data-testid="register-confirm-password"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-medium text-red-600"
                >
                  {errors.confirmPassword}
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

            {successMessage && (
              <p
                data-testid="form-success"
                className="rounded-md bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700"
              >
                {successMessage}
              </p>
            )}

            <Button
              type="submit"
              data-testid="register-submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Creating account..." : "Register"}
            </Button>

            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-blue-600 hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
