"use client";

import { useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { setToken } from "@/lib/apiClient";
import { useDispatch, useSelector } from "react-redux";
import { initializeSession } from "@/app/(secure)/state/actions";
import { toast } from "sonner";
import { RootState } from "@/app/store/reducer";

export default function SessionInitializer() {
  const auth = useAuth();
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();
  const existingUser = useSelector((state: RootState) => state.app.user);

  useEffect(() => {
    const initialize = async () => {
      const token = await auth.getToken();
      setToken(token);
      if (isLoaded && user && !existingUser) {
        // Only call initializeSession if no user exists in state
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
  }, [auth, user, isLoaded, dispatch, existingUser]);

  return null;
}
