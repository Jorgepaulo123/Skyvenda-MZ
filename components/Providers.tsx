"use client";
import React from "react";
import { LoadingProvider } from "../context/LoadingContext";
import { AuthProvider } from "../context/AuthContext";
import HomeProvider from "../context/HomeContext";
import { WebSocketProvider } from "../context/websoketContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoadingProvider>
      <AuthProvider>
        <HomeProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </HomeProvider>
      </AuthProvider>
    </LoadingProvider>
  );
}
