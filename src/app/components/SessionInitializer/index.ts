"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { setToken } from "@/lib/apiClient";
import { useDispatch } from "react-redux";
import { initializeSession } from "@/app/(secure)/state/actions";
import { toast } from "sonner";

export default function SessionInitializer() {
  const auth = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const initialize = async () => {
      const token = await auth.getToken();
      setToken(token);
      if (isLoaded && user) {
        // Call initializeSession and check for 'existed' property
        const result = await dispatch<any>(
          initializeSession(
            user.id,
            user.primaryEmailAddress?.emailAddress || "",
            user.fullName || ""
          )
        );
        if (result && typeof result === "object" && result.existed === false) {
          toast.success("Thanks for creating an account!");
        }
      }
    };
    initialize();
  }, [auth, user, isLoaded, dispatch]);

  return null;
}
