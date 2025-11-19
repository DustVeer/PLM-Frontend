// src/pages/StatusFormPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusPillSmall from "../../components/StatusPillSmall";
import StatusesApi from "../../apis/statuses";

const API_BASE = "/api/statuses";


export default function AddEditStatus() {
  const { id } = useParams(); // undefined for /statuses/new
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    statusColorHex: "#E5E7EB",
    sortOrder: 0,
    active: true,
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;
    loadStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadStatus() {
    try {
      setLoading(true);
      setError("");
      const response = await StatusesApi.get(id);
     
      setForm({
        name: response.name ?? "",
        description: response.description ?? "",
        statusColorHex: response.statusColorHex ?? "#E5E7EB",
        sortOrder: response.sortOrder ?? 0,
        active: response.active ?? true,
      });

    } catch (err) {
      setError(err.message || "Failed to load status");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    console.log("Form", form);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body = {
        name: form.name,
        description: form.description,
        statusColorHex: form.statusColorHex,
        sortOrder: Number(form.sortOrder) || 0,
        active: form.active ? 1 : 0,
      };

      var response;

      if (isEditing) {
        response = await StatusesApi.update(id, body);
      }
      else {
        response = await StatusesApi.create(body);
      }

      setForm({
        name: response.name ?? "",
        description: response.description ?? "",
        statusColorHex: response.statusColorHex ?? "#E5E7EB",
        sortOrder: response.sortOrder ?? 0,
        active: response.active ?? true,
      });

      navigate("/statuses");
    } catch (err) {
      setError(err.message || "Failed to save status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
            onClick={() => navigate("/statuses")}
            className="text-link"
          >
            ← Back to Statuses
          </button>
            <h1 className="text-xl font-semibold text-gray-900 mt-4">
              {isEditing ? "Edit status" : "Create new status"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Update the details of this product status."
                : "Define a new status that can be used on products."}
            </p>
          </div>
          
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading status...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                required
                className="form-input"
                placeholder="e.g. Concept, Development, Production"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleFormChange}
                rows={3}
                className="form-input"
                placeholder="Optional description for this status"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="statusColorHex"
                    value={form.statusColorHex}
                    onChange={handleFormChange}
                    className="h-10 w-12 rounded border border-indigo-900 cursor-pointer"
                  />
                  <input
                    type="text"
                    name="statusColorHex"
                    value={form.statusColorHex}
                    onChange={handleFormChange}
                    className="form-input"
                    placeholder="#E5E7EB"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  Used as background color for the status pill.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={form.sortOrder}
                  onChange={handleFormChange}
                  className="form-input"
                />
                <p className="mt-1 text-xs text-gray-400">
                  Lower numbers appear first in lists.
                </p>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                id="active"
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleFormChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="active"
                className="ml-2 text-sm text-gray-700"
              >
                Status is active and available for products
              </label>
            </div>

            <div className="mt-4">
              <span className="block text-xs font-medium text-gray-500 mb-1">
                Preview
              </span>
              <StatusPillSmall
                label={form.name || "Status name"}
                color={form.statusColorHex}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/statuses")}
                className="btn-cancel"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-green"
                disabled={saving}
              >
                {saving
                  ? isEditing
                    ? "Saving..."
                    : "Creating..."
                  : isEditing
                  ? "Save changes"
                  : "Create status"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
