// src/pages/workflows/WorkflowListPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatusPillSmall from "../components/StatusPillSmall";
import WorkflowsApi from "../apis/workflows";

export default function Workflows() {
    const navigate = useNavigate();

    const [workflows, setWorkflows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all"); // all | active | inactive

    useEffect(() => {
        loadWorkflows();
    }, []);

   async function toggleActive(wf) {
           try {
               setError("");

               console.log("Toggling active for workflow:", wf);
   
               const response = await WorkflowsApi.toggleActive(wf.id);

               console.log("Toggle active response:", response);
   
               setWorkflows((prev) =>
                   prev.map((w) => (w.id === wf.id ? response : w))
               );
           } catch (err) {
               setError(err.message || "Failed to update status");
           }
       }

    async function loadWorkflows() {
        try {
            setLoading(true);
            setError("");
            const response = await WorkflowsApi.list();
            // Expected: [{ id, name, description, active, isDefault, createdAt, updatedAt, workflowStatuses: [...] }]
            setWorkflows(response || []);
        } catch (err) {
            setError(err.message || "Failed to load workflows");
        } finally {
            setLoading(false);
        }
    }

    const filteredWorkflows = useMemo(() => {
        return workflows
            .filter((wf) => {
                if (filter === "active") return wf.active;
                if (filter === "inactive") return !wf.active;
                return true;
            })
            .filter((wf) => {
                if (!search.trim()) return true;
                const term = search.toLowerCase();
                return (
                    wf.name?.toLowerCase().includes(term) ||
                    wf.description?.toLowerCase().includes(term)
                );
            });
    }, [workflows, filter, search]);

    function formatDate(value) {
        if (!value) return "-";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return value;
        return date.toLocaleString();
    }

    function renderStatusesPreview(workflow) {
        const statuses = (workflow.statuses || [])
            .slice()
            .sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

        if (statuses.length === 0) {
            return <span className="text-xs text-gray-400">No statuses</span>;
        }

        const maxToShow = 3;
        const first = statuses.slice(0, maxToShow);
        const remaining = statuses.length - first.length;

        return (
            <div className="flex flex-wrap gap-1">
                {first.map((ws) => (
                    <StatusPillSmall
                        key={ws.id}
                        label={ws.name || "Unnamed"}
                        color={ws.statusColorHex}
                    />

                ))}
                {remaining > 0 && (
                    <span className="text-xs text-gray-500 self-center">
                        +{remaining} more
                    </span>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen px-6 py-8">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 px-6 py-6">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Workflows
                        </h1>
                        <p className="text-sm text-gray-500">
                            Manage product workflows and the statuses they use.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/workflows/new")}
                        className="btn-green"
                    >
                        + Create workflow
                    </button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-1 text-xs">
                        <button
                            type="button"
                            onClick={() => setFilter("all")}
                            className={
                                "px-3 py-1 rounded-full " +
                                (filter === "all"
                                    ? "bg-white shadow-sm text-gray-900 hover:cursor-pointer  hover:scale-105 duration-150"
                                    : "text-gray-500 hover:text-gray-800 hover:cursor-pointer  hover:scale-105 duration-150")
                            }
                        >
                            All
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter("active")}
                            className={
                                "px-3 py-1 rounded-full " +
                                (filter === "active"
                                    ? "bg-white shadow-sm text-gray-900 hover:cursor-pointer  hover:scale-105 duration-150"
                                    : "text-gray-500 hover:text-gray-800 hover:cursor-pointer  hover:scale-105 duration-150")
                            }
                        >
                            Active
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilter("inactive")}
                            className={
                                "px-3 py-1 rounded-full " +
                                (filter === "inactive"
                                    ? "bg-white shadow-sm text-gray-900 hover:cursor-pointer  hover:scale-105 duration-150"
                                    : "text-gray-500 hover:text-gray-800 hover:cursor-pointer  hover:scale-105 duration-150")
                            }
                        >
                            Inactive
                        </button>
                    </div>

                    <div className="w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Search by name or description..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="form-input text-sm"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <p className="text-sm text-gray-500">Loading workflows...</p>
                ) : filteredWorkflows.length === 0 ? (
                    <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <p className="mb-2">No workflows found.</p>
                        <button
                            onClick={() => navigate("/workflows/new")}
                            className="text-link"
                        >
                            Create your first workflow
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 px-4">Statuses</th>
                                    <th className="py-2 px-4">Active</th>
                                    <th className="py-2 px-4">Updated</th>
                                    <th className="py-2 pl-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredWorkflows.map((wf) => (
                                    <tr
                                        key={wf.id}
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        {/* WF-Name */}
                                        <td className="py-3 pr-4 align-top">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">
                                                    {wf.name}
                                                </span>
                                                {wf.description && (
                                                    <span className="text-xs text-gray-500">
                                                        {wf.description}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* WF-Statuses */}
                                        <td className="py-3 px-4 align-top">
                                            {renderStatusesPreview(wf)}
                                        </td>

                                        {/* WF-Active */}
                                        <td className="px-4 py-3 text-sm">
                                            <button
                                                onClick={() => toggleActive(wf)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${wf.active
                                                    ? "bg-green-50 text-green-700 border-green-200 hover:cursor-pointer hover:scale-125 duration-150 "
                                                    : "bg-gray-50 text-gray-500 border-gray-200 hover:cursor-pointer hover:scale-125 duration-150 "
                                                    }`}
                                            >
                                                <span
                                                    className={`mr-2 inline-block h-2 w-2 rounded-full ${wf.active ? "bg-green-500" : "bg-gray-400"
                                                        }`}
                                                />
                                                {wf.active ? "Active" : "Inactive"}
                                            </button>
                                        </td>

                                        {/* WF-Updated */}
                                        <td className="py-3 px-4 align-top text-xs text-gray-500">
                                            {formatDate(wf.updatedAt)}
                                        </td>
                                        <td className="py-3 pl-4 align-top text-right">
                                            <button
                                                onClick={() => navigate(`/workflows/${wf.id}`)}
                                                className="text-link text-sm"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
