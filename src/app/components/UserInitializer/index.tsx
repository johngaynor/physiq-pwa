"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { setApiUserId } from "@/lib/userContext";

export function UserInitializer() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user?.id) {
      setApiUserId(user.id);
    }
  }, [isLoaded, user?.id]);

  return null;
}
