"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { setToken } from "@/lib/apiClient";

export default function SessionInitializer() {
  const auth = useAuth();

  useEffect(() => {
    const initializeSession = async () => {
      const token = await auth.getToken();

      //   console.log("token retrieved:", token);
      setToken(token);
    };

    initializeSession();
  }, [auth]);

  return null;
}
