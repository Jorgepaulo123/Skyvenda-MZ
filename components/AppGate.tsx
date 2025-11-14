"use client";
import React, { useEffect } from "react";
import { useLoading } from "../context/LoadingContext";
import { useAuth } from "../context/AuthContext";
import FullScreenLoader from "./loaders/FullScreenLoader";

export default function AppGate({ children }: { children: React.ReactNode }) {
  const { isLoading, setIsLoading } = useLoading();
  const { loading: authLoading } = useAuth();
  const setLoading = (setIsLoading as unknown) as (v: boolean) => void;

  useEffect(() => {
    // Política: exibir overlay enquanto o AuthProvider está carregando no boot.
    // LoadingContext começa como true; quando authLoading terminar, escondemos.
    if (authLoading) {
      setLoading(true);
    } else if (isLoading) {
      const t = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(t);
    }
  }, [authLoading, isLoading, setLoading]);

  return (
    <>
      {isLoading && <FullScreenLoader />}
      {children}
    </>
  );
}
