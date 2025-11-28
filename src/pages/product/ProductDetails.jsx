import { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredUserId } from "../../context/AuthContext";
import ProductsApi from "../../apis/products";
import StatusesApi from "../../apis/statuses";
import StatusPill from "../../components/productPages/StatusPill";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const userId = JSON.parse(getStoredUserId());

    const [product, setProduct] = useState(null);
    const [newStatusId, setNewStatusId] = useState(null);
    const [form, setForm] = useState(null);
    const [requiredFields, setRequiredFields] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Load product details on mount
    useEffect(() => {

        async function fetchProductData() {
            setError(null);
            setLoading(true);
            setIsEditing(false);

            try {
                const productData = await ProductsApi.getById(id);
                setProduct(productData);

                setForm({
                    name: productData.name || "",
                    description: productData.description || "",
                    categoryId: productData.productCategory?.id ?? "",
                    statusId: productData.productStatus?.id ?? "",
                    updatedBy: productData.updatedBy?.id || "",
                    workflow: productData.workflow || "",
                    colour: productData.colour || "",
                    price: productData.price || "",

                });
            } catch (err) {
                setError(err.message || "Failed to load product details.");
            } finally {
                setLoading(false);
            }
        }
        fetchProductData();


    }, [id]);


    // Function to update product details
    async function updateProduct() {
        setSaving(true);
        setError(null);
        try {

            // Backend update
            const updated = await ProductsApi.update(id, {
                name: form.name,
                description: form.description,
                categoryId: parseInt(form.categoryId),
                statusId: parseInt(form.statusId),
                updatedById: userId,
                colour: form.colour,
                price: parseFloat(form.price),
            });

            setProduct(updated);
            // sync form with backend result
            setForm({
                name: updated.name || "",
                description: updated.description || "",
                categoryId: updated.productCategory?.id ?? "",
                statusId: updated.productStatus?.id ?? "",
                updatedById: userId,
                workflow: updated.workflow || "",
                colour: updated.colour || "",
                price: updated.price || "",
            });
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Failed to save product.");
        } finally {
            setSaving(false);
        }
    }


    async function handelStatusChange(statusId) {
        if (!statusId || !product) return;
        setSaving(true);
        setError(null);

        try {
            const updated = await ProductsApi.changeStatus(id, statusId);
            setProduct(updated);

            setSaving(false);
        } catch (err) {
            console.error("Error changing status:", err.body);

            let message = err.body?.message || "Failed to change status.";
            let missing = err.body?.missingRequiredFields || [];

            setError({ message, missing });

            setSaving(false);
        }

        console.log("newStatusId changed:", newStatusId);
    }



    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSave(e) {
        e.preventDefault();
        if (!form) return;

        await updateProduct();
    }


    function handleCancelEdit() {
        setIsEditing(false);

    }

    if (loading || !product || !form) {
        return (
            <div className="p-8">
                <p className="text-gray-600 text-sm">Loading product details...</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-3">
            {/* Back button */}
            <button
                onClick={() => navigate("/products")}
                className="text-sm text-indigo-600 hover:underline hover:cursor-pointer"
            >
                ← Back to products
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {isEditing ? form.name : product.name}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Product ID:{" "}
                        <span className="font-mono text-gray-700">{product.id}</span>
                    </p>
                </div>


                {/* Statuses pils */}
                <div className="flex items-center">

                    {product.workflow.statuses?.map((status, index) => {
                        const isLatest = index === product.workflow.statuses.length - 1;
                        const isCurrent = product.productStatus && (status.id === product.productStatus.id);
                        const isBehind = product.productStatus && (status.id < product.productStatus.id);

                        return (
                            <div key={index} className="flex items-center gap-1">
                                <button className="flex items-center"  onClick={() => handelStatusChange(status.id)}>
                                    <StatusPill status={status} isCurrent={isCurrent} isBehind={isBehind} />
                                </button>
                                {!isLatest && (
                                    <span className="material-icons-outlined mr-2">arrow_forward</span>
                                )}
                            </div>
                        );
                    })}

                </div>
                <div className="flex items-center gap-1">

                    {/* Edit / Save buttons */}
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-lg rounded-lg bg-indigo-600 text-white hover:bg-indigo-800 hover:cursor-pointer hover:scale-105 transform transition-all duration-150"
                        >
                            Edit
                        </button>
                    ) : (
                        <div className="flex gap-2">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="btn-green"
                            >
                                {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="rounded-md bg-red-50 text-red-700 text-sm p-3">
                    {error.message}
                    {error.missing && error.missing.length > 0 && (
                        <ul className="mt-2 list-disc list-inside">
                            {error.missing.map((field, index) => (
                                <li key={index}>{field}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Main content card */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left: general info */}
                <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Product details
                    </h2>

                    {!isEditing ? (
                        // VIEW MODE
                        <dl className="mt-4 space-y-4 text-sm">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                <dt>Name</dt>
                                <dd className="font-medium text-gray-900">{product.name}</dd>
                            </div>
                            <hr className="text-gray-300" />
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                <dt>Category</dt>
                                <dd className="font-medium text-gray-900">
                                    {product.productCategory?.name ?? "—"}
                                </dd>
                            </div>
                            <hr className="text-gray-300" />
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                                <dt>Status</dt>
                                <dd className="font-medium text-gray-900">
                                    {product.productStatus?.name ?? "—"}
                                </dd>
                            </div>
                            <hr className="text-gray-300" />
                            <div className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 ${error?.missing?.includes("colour") ? "bg-red-100 p-2 rounded-md shadow-sm" : ""}`}>
                                <dt>Colour</dt>
                                <dd className={`font-medium `}>
                                    {product.colour || "—"}
                                </dd>
                            </div>
                            <hr className="text-gray-300" />
                            <div className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 ${error?.missing?.includes("price") ? "bg-red-100 p-2 rounded-md shadow-sm" : ""}`}>
                                <dt>Price</dt>
                                <dd className={`font-medium `}>
                                    {product.price || "—"}
                                </dd>
                            </div>
                            <hr className="text-gray-300" />
                            <div className={`flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 ${error?.missing?.includes("description") ? "bg-red-100 p-2 rounded-md shadow-sm" : ""}`}>
                                <dt className="mb-1">Description</dt>
                                <dd className="text-gray-800 whitespace-pre-line">
                                    {product.description || "No description provided."}
                                </dd>
                            </div>

                        </dl>
                    ) : (
                        // EDIT MODE
                        <form className="mt-4 space-y-4 text-sm" onSubmit={handleSave}>
                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>

                            <hr className="text-gray-300" />

                            {/* Category */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700 ">
                                    Category
                                </label>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/products/${product.id}/category`)}
                                    className="text-smhover:underline hover:cursor-pointer mb-1 bg-blue-500 text-white px-2 py-1 rounded-md w-max"
                                >
                                    Change Category
                                </button>
                            </div>

                            <hr className="text-gray-300" />


                            {/* Colour */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700">Colour</label>
                                <input
                                    type="text"
                                    name="colour"
                                    value={form.colour}
                                    onChange={handleChange}
                                    className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200"
                                    required
                                />
                            </div>

                             <hr className="text-gray-300" />


                            {/* Price */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-200"
                                    required
                                />
                            </div>

                            <hr className="text-gray-300" />


                            {/* Description */}
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Secondary save/cancel at bottom */}
                            <div className="pt-2 flex gap-2">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="btn-green"
                                >
                                    {saving ? "Saving..." : "Save changes"}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="btn-cancel"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Right: meta info */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Created At
                        </h3>
                        <p>{product.createdAt ? new Date(product.createdAt).toLocaleString() : "—"}</p>
                        <div className="mt-3 text-sm space-y-1">
                            <p className="text-gray-900">Created By</p>
                            <p className="text-gray-900">
                                Name: {product.createdBy?.name ?? "Unknown"}
                            </p>
                            <p className="text-gray-900">
                                Email: {product.createdBy?.email ?? "Unknown"}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Last updated At
                        </h3>
                        <p>{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : "—"}</p>
                        <div className="mt-3 text-sm space-y-1">
                            <p className="text-gray-900">Last Updated By</p>
                            <p className="text-gray-900">
                                Name: {product.updatedBy?.name ?? "Unknown"}
                            </p>
                            <p className="text-gray-900">
                                Email: {product.updatedBy?.email ?? "Unknown"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
