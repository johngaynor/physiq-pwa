"use client";
import React from "react";
import { useUser } from "@clerk/nextjs";
import Dashboard from "./Dashboard";

const Main = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        {/* <h1 className="scroll-m-20 font-extrabold tracking-tight text-6xl md:text-8xl text-center">
          Bodybuilding Redefined.
        </h1> */}
      </div>
    );
  } else return <Dashboard />;
};

export default Main;
