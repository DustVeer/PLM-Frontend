import React, { useEffect, useState } from "react";

export default function ProductCard() {
  const [id, setId] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/products/${id}`)
      .then(async (r) => {
        if (!r.ok)
          throw new Error(
            r.status === 404 ? "Product niet gevonden" : "Serverfout"
          );
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Product ID</label>
        <input
          type="number"
          min={1}
          className="w-40 border rounded-lg px-3 py-2"
          value={id}
          onChange={(e) => setId(Number(e.target.value))}
        />
      </div>

      <div className="border rounded-2xl p-5 shadow">
        {loading && <p className="text-sm">Laden…</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && data && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Product #{data.id}</h2>
            <p className="text-gray-700">
              <span className="font-medium">Name:</span> {data.name}
            </p>
          </div>
        )}
        {!loading && !error && !data && (
          <p className="text-sm text-gray-500">Geen data</p>
        )}
      </div>
    </div>
  );
}
