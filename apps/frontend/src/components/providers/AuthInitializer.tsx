"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

/**
 * Mounted in the root layout. On every page load it calls loadUser()
 * so the API client's bearer token is restored from the Zustand-persisted
 * store before any authenticated fetch runs.
 */
export function AuthInitializer() {
  const { loadUser, token } = useAuth();
  useEffect(() => {
    if (token) loadUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
