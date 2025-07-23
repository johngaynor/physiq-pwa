"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { setToken } from "@/lib/apiClient";
import { useDispatch } from "react-redux";
import { initializeUser } from "@/app/(secure)/state/actions";

export default function SessionInitializer() {
  const auth = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeSession = async () => {
      const token = await auth.getToken();
      setToken(token);
      if (isLoaded && user) {
        dispatch<any>(
          initializeUser(
            user.id,
            user.primaryEmailAddress?.emailAddress || "",
            user.fullName || ""
          )
        );
      }
    };
    initializeSession();
  }, [auth, user, isLoaded, dispatch]);

  return null;
}
