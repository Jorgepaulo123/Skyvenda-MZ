"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/AuthContext";
import { HomeContext } from "@/context/HomeContext";
import { base_url } from "@/api/api";
import { useToast } from "@/hooks/use-toast";
import { ProductCardSkeleton2 } from "@/components/skeleton/productcardskeleton2";
import MobileHeader from "@/components/ui/MobileHeader";

// Minimal local product card for this page
function ProductCard({ product, onEdit, onTurbo }: { product: any; onEdit: (p:any)=>void; onTurbo: (p:any)=>void }) {
  const title = product?.title || product?.nome || "Sem título";
  const price = product?.price ?? product?.preco;
  const displayPrice = typeof price === "number" ? new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN' }).format(price) : "—";
  return (
    <div className="border rounded-lg p-3 bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:gap-3">
        {product?.thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumb}
            alt={title}
            className="w-full h-40 object-cover rounded md:w-16 md:h-16 md:shrink-0"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded md:w-16 md:h-16" />
        )}
        <div className="flex-1 min-w-0 mt-2 md:mt-0">
          <div className="text-base md:text-sm font-semibold truncate">{title}</div>
          <div className="text-sm md:text-xs text-gray-500">{displayPrice}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 md:flex md:gap-2 md:mt-2">
        <button
          onClick={() => onEdit(product)}
          className="col-span-1 px-3 py-2 md:py-1.5 text-sm md:text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Editar
        </button>
        <button
          onClick={() => onTurbo(product)}
          className="col-span-1 px-3 py-2 md:py-1.5 text-sm md:text-xs rounded bg-amber-600 text-white hover:bg-amber-700"
        >
          Turbinar
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const router = useRouter();
  const { myproducts, addProducts } = useContext(HomeContext) as any;
  const { token } = useContext(AuthContext) as any;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<1 | 2 | 3>(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Local filters like original Page1
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activos" | "desativados" | "autorenovacao">("todos");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!token && myproducts) {
        setLoading(false);
        return;
      }
      if (Array.isArray(myproducts) && myproducts.length >= 1) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${base_url}/produtos/produtos/?skip=0&limit=20`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        const list = Array.isArray((data as any)?.produtos) ? (data as any).produtos : [];
        if (!cancelled) addProducts(list);
      } catch (err: any) {
        console.error("Erro ao buscar produtos:", err);
        if (!cancelled) addProducts([]);
        toast({ title: "Erro ao buscar produtos", description: err?.userMessage || err?.message || "Tente novamente." , variant: "destructive"});
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const filteredProducts = useMemo(() => {
    return (myproducts || [])
      .filter(Boolean)
      .filter((p: any) => {
        const title = (p?.title || "").toLowerCase();
        const matchesSearch = title.includes(searchTerm.toLowerCase());
        const isActive = Boolean(p?.ativo ?? p?.active ?? false);
        const isAutoRenew = Boolean(p?.autorenovacao ?? p?.auto_renovacao ?? p?.autoRenew ?? false);
        const matchesStatus =
          statusFilter === "todos" ||
          (statusFilter === "activos" && isActive) ||
          (statusFilter === "desativados" && !isActive) ||
          (statusFilter === "autorenovacao" && isAutoRenew);
        return matchesSearch && matchesStatus;
      });
  }, [myproducts, searchTerm, statusFilter]);

  const counts = useMemo(() => {
    return (myproducts || []).reduce(
      (acc: any, p: any) => {
        const isActive = Boolean(p?.ativo ?? p?.active ?? false);
        const isAutoRenew = Boolean(p?.autorenovacao ?? p?.auto_renovacao ?? p?.autoRenew ?? false);
        acc.todos += 1;
        if (isActive) acc.activos += 1; else acc.desativados += 1;
        if (isAutoRenew) acc.autorenovacao += 1;
        return acc;
      },
      { todos: 0, activos: 0, desativados: 0, autorenovacao: 0 }
    );
  }, [myproducts]);

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setPage(2);
  };
  const handleTurbo = (product: any) => {
    setSelectedProduct(product);
    setPage(3);
  };

  return (
    <div className="p-4 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden -mt-4 -mx-4 mb-2">
        <MobileHeader title="Meus Produtos" onBack={() => router.back()} right={null} />
      </div>
      {page === 1 && (
        <div className="bg-white md:rounded-lg md:shadow md:h-[calc(100vh-100px)] md:overflow-y-hidden">

          <div className="p-4 border-b">
            <div className="hidden md:flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Meus Produtos</h2>
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-lg px-4 py-2 text-sm w-64 focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="md:hidden mt-2">
              <input
                type="text"
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="mt-3 -mx-1 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 px-1">
                {[
                  { key: 'todos', label: `Todos (${counts.todos})` },
                  { key: 'activos', label: `Activos (${counts.activos})` },
                  { key: 'desativados', label: `Desativados (${counts.desativados})` },
                  { key: 'autorenovacao', label: `Auto-renovação (${counts.autorenovacao})` },
                ].map((tab: any) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      statusFilter === tab.key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Mobile list */}
          <div className="md:hidden p-4 space-y-2">
            {loading ? (
              [...Array(8)].map((_, i) => <ProductCardSkeleton2 key={i} />)
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center">
                <p className="text-gray-500">Nenhum produto encontrado</p>
              </div>
            ) : (
              filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} onEdit={handleEdit} onTurbo={handleTurbo} />
              ))
            )}
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4 max-h-[calc(100vh-180px)] overflow-y-scroll">
            {loading ? (
              [...Array(12)].map((_, i) => <ProductCardSkeleton2 key={i} />)
            ) : filteredProducts.length === 0 ? (
              <div className="flex justify-center items-center col-span-full">
                <p className="text-gray-500">Nenhum produto encontrado</p>
              </div>
            ) : (
              filteredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} onEdit={handleEdit} onTurbo={handleTurbo} />
              ))
            )}
          </div>
        </div>
      )}

      {page === 2 && (
        <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setPage(1)} className="px-3 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200">Voltar</button>
            <div className="font-semibold">Editar Produto</div>
          </div>
          <div className="text-sm text-gray-500">Em breve: editor completo (nome, preço, categoria, imagem)...</div>
          <div className="mt-3 p-3 bg-gray-50 rounded">{selectedProduct?.title}</div>
        </div>
      )}

      {page === 3 && (
        <div className="bg-white rounded-lg shadow h-[calc(100vh-100px)] p-4">
          <div className="flex items-center gap-2 mb-4">
            <button onClick={() => setPage(1)} className="px-3 py-1.5 text-xs rounded bg-gray-100 hover:bg-gray-200">Voltar</button>
            <div className="font-semibold">Turbinar Produto</div>
          </div>
          <div className="text-sm text-gray-500">Em breve: formulário de promoção (duração, posicionamento)...</div>
          <div className="mt-3 p-3 bg-gray-50 rounded">{selectedProduct?.title}</div>
        </div>
      )}
    </div>
  );
}
