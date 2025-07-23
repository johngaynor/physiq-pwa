"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { setToken } from "@/lib/apiClient";
import { useDispatch } from "react-redux";
import { initializeUser } from "@/app/(secure)/state/actions";
import { toast } from "sonner";

export default function SessionInitializer() {
  const auth = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSession = async () => {
      const token = await auth.getToken();
      setToken(token);
      if (isLoaded && user) {
        // Call initializeUser and check for 'existed' property
        const result = await dispatch<any>(
          initializeUser(
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
    initializeSession();
  }, [auth, user, isLoaded, dispatch]);

  return null;
}
