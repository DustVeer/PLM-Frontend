import React, { useState } from "react";
import { useProduct } from "../hooks/useProducts";

export default function ProductCard() {
  const [id, setId] = useState(1);
  const { data, loading, error } = useProduct(id);

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
        {loading && <p>Loading…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && data && (
          <>
            <h2 className="text-lg font-semibold mb-2">Product #{data.id}</h2>
            <p>
              <span className="font-medium">Name:</span> {data.name}
            </p>
            <p>
              <span className="font-medium">Price:</span>{" "}
              {data.price != null
                ? `€${Number(data.price).toFixed(2)}`
                : "n.v.t."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
