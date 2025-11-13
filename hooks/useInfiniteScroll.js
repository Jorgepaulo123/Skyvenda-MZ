"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Minimal infinite scroll hook used by DesktopFeed/MobileFeed.
 *
 * @param {Object} opts
 * @param {(args:{cursor:string,isRefresh:boolean,signal:AbortSignal})=>Promise<{data:any[],hasMore:boolean,nextCursor?:string}>} opts.fetchData
 * @param {string} [opts.initialCursor="1"]
 * @param {number} [opts.minPaginationInterval=500]
 * @param {number} [opts.maxItems=100]
 * @param {boolean} [opts.debug=false]
 */
export default function useInfiniteScroll({
  fetchData,
  initialCursor = "1",
  minPaginationInterval = 500,
  maxItems = 100,
  debug = false,
}) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(String(initialCursor || "1"));
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const lastLoadTsRef = useRef(0);

  const log = (...args) => {
    if (debug) console.log("[useInfiniteScroll]", ...args);
  };

  const cleanupAbort = () => {
    if (abortRef.current) {
      try { abortRef.current.abort(); } catch {}
      abortRef.current = null;
    }
  };

  const loadPage = useCallback(async (isRefresh = false) => {
    if (!fetchData || typeof fetchData !== "function") return;

    // Respect min interval when loading more
    const now = Date.now();
    if (!isRefresh && now - lastLoadTsRef.current < minPaginationInterval) {
      log("Throttled loadMore");
      return;
    }

    cleanupAbort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      if (isRefresh) {
        setRefreshing(true);
        setError(null);
      } else if (items.length === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const pageCursor = isRefresh ? String(initialCursor || "1") : String(cursor || "1");
      log("Fetching page", { pageCursor, isRefresh });

      const res = await fetchData({ cursor: pageCursor, isRefresh, signal: controller.signal });
      const newItems = Array.isArray(res?.data) ? res.data : [];
      const nextCursor = res?.nextCursor ? String(res.nextCursor) : String(Number(pageCursor) + 1);
      const pageHasMore = Boolean(res?.hasMore);

      const advanced = nextCursor !== pageCursor;
      // Continue if server says there is more OR the cursor advanced, even if this page came empty
      const effectiveHasMore = Boolean(pageHasMore || advanced);

      setHasMore(effectiveHasMore);
      setCursor(nextCursor);

      setItems(prev => {
        const combined = isRefresh ? newItems : [...prev, ...newItems];
        // cap by maxItems (keep most recent at the end of array)
        if (combined.length > maxItems) {
          return combined.slice(combined.length - maxItems);
        }
        return combined;
      });

      setError(null);
      lastLoadTsRef.current = Date.now();
    } catch (e) {
      const isAbort = e?.name === "AbortError" || e?.name === "CanceledError" || e?.code === "ERR_CANCELED" || /aborted|canceled/i.test(e?.message || "");
      if (isAbort) {
        log("Request aborted");
        // Do not set error on cancel
      } else {
        log("Fetch error", e);
        setError(e?.message || "Erro ao carregar feed");
      }
    } finally {
      if (isRefresh) setRefreshing(false);
      setLoading(false);
      setLoadingMore(false);
      cleanupAbort();
    }
  }, [fetchData, cursor, initialCursor, items.length, maxItems, minPaginationInterval, debug]);

  const refresh = useCallback(() => {
    return loadPage(true);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    if (loading || loadingMore || refreshing || !hasMore) return;
    return loadPage(false);
  }, [loading, loadingMore, refreshing, hasMore, loadPage]);

  const restart = useCallback(async () => {
    setItems([]);
    setCursor(String(initialCursor || "1"));
    setHasMore(true);
    setError(null);
    await loadPage(true);
  }, [initialCursor, loadPage]);

  useEffect(() => {
    // initial load
    loadPage(true);
    return () => cleanupAbort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items,
    loading,
    loadingMore,
    refreshing,
    hasMore,
    error,
    refresh,
    loadMore,
    restart,
  };
}
