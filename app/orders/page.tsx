"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MobileHeader from "@/components/ui/MobileHeader";
import { useAuth } from "@/context/AuthContext";
import { base_url } from "@/api/api";

type Order = {
  id: number;
  status?: string;
  data_criacao?: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const { token } = useAuth() as any;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${base_url}/pedidos/`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        } as RequestInit);
        if (!res.ok) throw new Error(`Erro ${res.status}`);
        const data = await res.json();
        const list: Order[] = Array.isArray(data) ? data : (Array.isArray(data?.pedidos) ? data.pedidos : []);
        if (!cancelled) setOrders(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Erro ao carregar pedidos");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen bg-white">
      <MobileHeader title="My Orders" onBack={() => router.back()} right={null} />

      <div className="max-w-3xl mx-auto px-4 py-4">
        {loading && (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="animate-pulse h-16 rounded-lg bg-gray-100" />
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-red-500">{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="text-center text-gray-500">You have no orders yet.</div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-900">Order #{o.id}</div>
                <div className="text-xs text-gray-600">{o.status || o.data_criacao || "—"}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
