// src/pages/product/AddProductPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsApi from "../../apis/products";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    productCategoryId: "",
    productStatusId: "",
  });

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {

        const created = await ProductsApi.create({
          name: form.name,
          description: form.description,
          productCategoryId: parseInt(form.productCategoryId),
            productStatusId: parseInt(form.productStatusId),
        });

      navigate(`/products/${created.id}`); // redirect to the product details page
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 bg-white rounded-xl shadow-lg animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-indigo-600 hover:underline hover:cursor-pointer"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-gray-900">Product Toevoegen</h1>

      {error && (
        <div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Naam
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Beschrijving
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category ID
          </label>
          <input
            type="number"
            name="productCategoryId"
            value={form.productCategoryId}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-800"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Status ID
          </label>
          <input
            type="number"
            name="productStatusId"
            value={form.productStatusId}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          {saving ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
