// src/pages/StatusListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusesApi from "../apis/statuses";
import StatusPill from "../components/StatusPillSmall";



export default function StatusListPage() {
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Load statuses on component mount
    useEffect(() => {
        fetchStatuses();
    }, []);

    // Fetch statuses from the API
    async function fetchStatuses() {
        try {
            setLoading(true);
            setError(null);
            const response = await StatusesApi.list();
            setStatuses(Array.isArray(response) ? response : []);

            console.log("Fetched statuses:", response);
        } catch (err) {
            setError(err.message || "Failed to load statuses");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(status) {
        if (!window.confirm(`Are you sure you want to delete status "${status.name}"?`)) {
            return;
        }

        try {
            setError("");
            await StatusesApi.delete(status.id);
            setStatuses((prev) => prev.filter((s) => s.id !== status.id));
        } catch (err) {
            setError(err.message || "Failed to delete status");
        }
    }

    async function toggleActive(status) {
        try {
            setError("");
            const updated = { ...status, active: !status.active ? 1 : 0 };

            const response = await StatusesApi.update(status.id, updated);

            setStatuses((prev) =>
                prev.map((s) => (s.id === status.id ? response : s))
            );
        } catch (err) {
            setError(err.message || "Failed to update status");
        }
    }

    const sortedStatuses = [...statuses].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
    );

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Product Status Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Create, update and remove product statuses. These statuses are
                            used across the product pages.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/statuses/add")}
                        className="btn-green"
                    >
                        + New status
                    </button>
                </header>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                            {loading
                                ? "Loading statuses..."
                                : `${sortedStatuses.length} statuses`}
                        </span>
                    </div>

                    {/* Table  */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pill
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Color
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Sort order
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Active
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {sortedStatuses.map((status) => (
                                    <tr key={status.id}>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <StatusPill
                                                label={status.name}
                                                color={status.statusColorHex}
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {status.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {status.description || "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="inline-block h-5 w-5 rounded-full border border-gray-300"
                                                    style={{
                                                        backgroundColor:
                                                            status.statusColorHex || "#E5E7EB",
                                                    }}
                                                />
                                                <span>
                                                    {status.statusColorHex || (
                                                        <span className="text-gray-400">default</span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {typeof status.sortOrder === "number"
                                                ? status.sortOrder
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <button
                                                onClick={() => toggleActive(status)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${status.active
                                                    ? "bg-green-50 text-green-700 border-green-200 hover:cursor-pointer hover:scale-125 duration-150 "
                                                    : "bg-gray-50 text-gray-500 border-gray-200 hover:cursor-pointer hover:scale-125 duration-150 "
                                                    }`}
                                            >
                                                <span
                                                    className={`mr-2 inline-block h-2 w-2 rounded-full ${status.active ? "bg-green-500" : "bg-gray-400"
                                                        }`}
                                                />
                                                {status.active ? "Active" : "Inactive"}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                                            <button
                                                onClick={() => navigate(`/statuses/${status.id}/edit`)}
                                                className="text-link mr-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(status)}
                                                className="text-link-red"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {!loading && sortedStatuses.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-sm text-gray-400"
                                        >
                                            No statuses found. Create your first status with the
                                            button above.
                                        </td>
                                    </tr>
                                )}

                                {loading && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-sm text-gray-400"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
