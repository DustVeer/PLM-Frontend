// src/pages/workflows/WorkflowFormPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StatusPillSmall from "../../components/StatusPillSmall";
import WorkflowsApi from "../../apis/workflows";
import StatusesApi from "../../apis/statuses";

export default function AddEditWorkflow() {
  const { id } = useParams(); // undefined for /workflows/new
  const isEditing = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    active: true,
    isDefault: false,
    statuses: [], 
  });

  const [allStatuses, setAllStatuses] = useState([]); // list from API
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load all statuses once, for the checkbox list
  useEffect(() => {
    loadStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load workflow when editing
  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }
    loadWorkflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadStatuses() {
    try {
      const response = await StatusesApi.list();
      setAllStatuses(response || []);
    } catch (err) {
    }
  }

  async function loadWorkflow() {
    try {
      setLoading(true);
      setError("");
      const response = await WorkflowsApi.get(id);
      // Expecting response like:
      // {
      //   id, name, description, active, isDefault,
      //   workflowStatuses: [{ id, orderIndex, status: { id, name, statusColorHex } }]
      // }
      setForm({
        name: response.name ?? "",
        description: response.description ?? "",
        active: response.active ?? true,
        isDefault: response.isDefault ?? false,
        statuses:
          response.workflowStatuses?.map(ws => ({
            statusId: ws.status?.id,
            sortOrder: ws.orderIndex ?? 0,
          })) ?? [],
      });
    } catch (err) {
      setError(err.message || "Failed to load workflow");
    } finally {
      setLoading(false);
    }
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // When toggling a status in the workflow
  function handleStatusToggle(statusId, checked) {
    setForm(prev => {
      if (checked) {
        // Add if not already present
        if (prev.statuses.some(s => s.statusId === statusId)) return prev;
        const maxOrder =
          prev.statuses.length > 0
            ? Math.max(...prev.statuses.map(s => s.sortOrder ?? 0))
            : 0;
        return {
          ...prev,
          statuses: [
            ...prev.statuses,
            { statusId, sortOrder: maxOrder + 1 },
          ],
        };
      } else {
        // Remove
        return {
          ...prev,
          statuses: prev.statuses.filter(s => s.statusId !== statusId),
        };
      }
    });
  }

  // Updating the sort order for a specific status
  function handleStatusOrderChange(statusId, newOrder) {
    const numeric = Number(newOrder) || 0;
    setForm(prev => ({
      ...prev,
      statuses: prev.statuses.map(s =>
        s.statusId === statusId ? { ...s, sortOrder: numeric } : s
      ),
    }));
  }

  // For preview and listing, enrich selected statuses with full data
  const selectedStatusesDetailed = useMemo(() => {
    return form.statuses
      .map(s => {
        const status = allStatuses.find(x => x.id === s.statusId);
        if (!status) return null;
        return {
          ...status,
          sortOrder: s.sortOrder,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [form.statuses, allStatuses]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const body = {
        name: form.name,
        description: form.description,
        active: form.active ? 1 : 0,
        isDefault: form.isDefault ? 1 : 0,
        workflowStatuses: form.statuses
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map((s, index) => ({
            statusId: s.statusId,
            orderIndex: s.sortOrder ?? index,
          })),
      };

      let response;
      if (isEditing) {
        response = await WorkflowsApi.update(id, body);
      } else {
        response = await WorkflowsApi.create(body);
      }

      // Optional: reset with response (in case backend normalises data)
      setForm({
        name: response.name ?? "",
        description: response.description ?? "",
        active: response.active ?? true,
        isDefault: response.isDefault ?? false,
        statuses:
          response.workflowStatuses?.map(ws => ({
            statusId: ws.status?.id,
            sortOrder: ws.orderIndex ?? 0,
          })) ?? [],
      });

      navigate("/workflows");
    } catch (err) {
      setError(err.message || "Failed to save workflow");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen px-6 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={() => navigate("/workflows")}
              className="text-link"
            >
              ← Back to Workflows
            </button>
            <h1 className="text-xl font-semibold text-gray-900 mt-4">
              {isEditing ? "Edit workflow" : "Create new workflow"}
            </h1>
            <p className="text-sm text-gray-500">
              {isEditing
                ? "Update the configuration of this workflow and its statuses."
                : "Define a new workflow and choose which statuses it uses."}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-sm text-gray-500">Loading workflow...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic details */}
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
                placeholder="e.g. Default footwear workflow"
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
                placeholder="Optional description for this workflow"
              />
            </div>

            {/* Flags */}
            <div className="flex flex-col gap-2 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Workflow is active and available for products
                </span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={form.isDefault}
                  onChange={handleFormChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Use this as the default workflow for new products
                </span>
              </label>
            </div>

            {/* Status selection */}
            <div className="mt-4">
              <h2 className="text-sm font-medium text-gray-700 mb-1">
                Workflow statuses
              </h2>
              <p className="text-xs text-gray-400 mb-3">
                Select which statuses belong in this workflow and set their
                order. Lower numbers appear earlier in the flow.
              </p>

              <div className="space-y-2 border rounded-xl px-4 py-3 bg-gray-50">
                {allStatuses.length === 0 ? (
                  <p className="text-xs text-gray-500">
                    No statuses found. Create statuses first.
                  </p>
                ) : (
                  allStatuses
                    .slice()
                    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                    .map(status => {
                      const selected = form.statuses.find(
                        s => s.statusId === status.id
                      );
                      return (
                        <div
                          key={status.id}
                          className="flex items-center justify-between gap-3 py-1"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={!!selected}
                              onChange={e =>
                                handleStatusToggle(status.id, e.target.checked)
                              }
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <StatusPillSmall
                              label={status.name}
                              color={status.statusColorHex}
                            />
                          </div>
                          {selected && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                Order
                              </span>
                              <input
                                type="number"
                                className="w-20 form-input px-2 py-1 text-sm"
                                value={selected.sortOrder}
                                onChange={e =>
                                  handleStatusOrderChange(
                                    status.id,
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="mt-4">
              <span className="block text-xs font-medium text-gray-500 mb-1">
                Preview
              </span>
              {selectedStatusesDetailed.length === 0 ? (
                <p className="text-xs text-gray-400">
                  No statuses selected yet.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {selectedStatusesDetailed.map(s => (
                    <StatusPillSmall
                      key={s.id}
                      label={`${s.sortOrder}. ${s.name}`}
                      color={s.statusColorHex}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/workflows")}
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
                  : "Create workflow"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
