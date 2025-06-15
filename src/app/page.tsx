"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Page from "./(secure)/page";

const Main = () => {
  const { user, isLoaded } = useUser();

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        {!isLoaded && (
          <div className="fixed inset-0 bg-slate-200 dark:bg-[#020513] z-40" />
        )}

        <h1 className="scroll-m-20 font-extrabold tracking-tight text-6xl md:text-8xl text-center">
          Bodybuilding Redefined.
        </h1>
      </div>
    );
  } else return <Page />;
};

export default Main;
