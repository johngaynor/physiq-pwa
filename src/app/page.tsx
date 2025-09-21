"use client";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Main = () => {
  const { user, isLoaded } = useUser();

  // Redirect authenticated users to dashboard
  if (user) redirect("/dashboard");

  // Redirect unauthenticated users to environment-specific sign-in URL
  if (isLoaded && !user) {
    const isProduction = process.env.NODE_ENV === "production";
    const signInUrl = isProduction
      ? "https://accounts.physiq.app/sign-in?redirect_url=https://my.physiq.app/dashboard"
      : "https://skilled-kid-59.accounts.dev/sign-in?redirect_url=https://my.physiq.app/dashboard";

    window.location.href = signInUrl;
    return null;
  }

  return null;
};

export default Main;
