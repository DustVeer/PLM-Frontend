// hooks/useProduct.js
import { useEffect, useState } from "react";
import { ProductsApi } from "../api's/products";

export function useProduct(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id == null) return;
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const product = await ProductsApi.getById(id, { signal: ac.signal });
        setData(product);
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message || "Onbekende fout");
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [id]);

  return { data, loading, error };
}
