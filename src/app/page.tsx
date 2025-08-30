"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";

const Main = () => {
  const { user, isLoaded } = useUser();
  const { theme, resolvedTheme } = useTheme();

  if (user) redirect("/dashboard");

  // Determine if we should use light or dark theme images
  const currentTheme = resolvedTheme || theme;
  const themeVariant = currentTheme === "light" ? "light" : "dark";

  return (
    <div className="flex h-screen flex-col items-center">
      {!isLoaded && (
        <div className="fixed inset-0 bg-slate-200 dark:bg-[#020513] z-40" />
      )}

      {/* <h1 className="scroll-m-20 font-extrabold tracking-tight text-6xl md:text-8xl text-center">
        Bodybuilding Redefined.
      </h1> */}

      {/* Mobile/Tablet - Stacked image (below md) */}
      <div className="mt-20 w-[90%] max-w-[800px] relative aspect-[800/1100] md:hidden">
        <Image
          src={`/images/stacked-subtitle1-${themeVariant}-transparent-1024x1024.png`}
          alt="Hero Background"
          fill
          className="object-contain"
        />
      </div>

      {/* Desktop - Horizontal image (md and above) */}
      <div className="mt-20 w-[90%] lg:w-[80%] max-w-[1400px] relative aspect-[2800/1100] hidden md:block">
        <Image
          src={`/images/inline-subtitle1-${themeVariant}-bg-2800x1100.jpg`}
          alt="Hero Background"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Main;
