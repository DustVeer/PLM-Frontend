import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsApi from "../../apis/products";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        async function fetchProductDetails() {
            setError(null);
            setLoading(true);

            try {
                const data = await ProductsApi.getById(id);
                setProduct(data);
            }
            catch (err) {
                setError(err.message || "Failed to load product details.");
            }
            finally {
                setLoading(false);
            }

        }
        console.log("data", product);
        fetchProductDetails();
    }, [id]);

    if (loading) {
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
                onClick={() => navigate(-1)}
                className="text-sm text-indigo-600 hover:underline hover:cursor-pointer"
            >
                ← Back to products
            </button>

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {product.name}
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Product ID: <span className="font-mono text-gray-700">{product.id}</span>
                    </p>
                </div>

                {/* Status pill with dynamic background */}
                <div
                    className={`px-5 py-5 rounded-full text-lg font-medium text-black ${product.productStatus?.statusColorHex
                        ? `bg-[${product.productStatus.statusColorHex}]`
                        : "bg-gray-500"
                        }`}
                >
                    {product.productStatus?.name ?? "Unknown status"}
                </div>
            </div>

            {/* Main content card */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Left: general info */}
                <div className="md:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Product details
                    </h2>

                    <dl className="mt-4 space-y-4 text-sm">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <dt className="text-gray-500">Name</dt>
                            <dd className="font-medium text-gray-900">{product.name}</dd>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <dt className="text-gray-500">Category</dt>
                            <dd className="font-medium text-gray-900">
                                {product.productCatagory?.name ?? "—"}
                            </dd>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                            <dt className="text-gray-500">Status</dt>
                            <dd className="font-medium text-gray-900">
                                {product.productStatus?.name ?? "—"}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-gray-500 mb-1">Description</dt>
                            <dd className="text-gray-800 whitespace-pre-line">
                                {product.description || "No description provided."}
                            </dd>
                        </div>
                    </dl>
                </div>

                {/* Right: meta info */}
                <div className="space-y-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Created by
                        </h3>
                        <div className="mt-3 text-sm space-y-1">
                            <p className="text-gray-900">
                                Naam: {product.createdBy?.name ?? "Niet bekend"}
                            </p>
                            <p className="text-gray-900">
                                Email: {product.createdBy?.email ?? "Niet bekend"}
                            </p>
                            <p className="text-gray-500">
                                Gebruikers ID: {product.createdBy?.id ?? "—"}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Timestamps
                        </h3>
                        <dl className="mt-3 space-y-2 text-xs text-gray-700">
                            <div>
                                <dt className="text-gray-500">Aangemaakt op</dt>
                                <dd>
                                    {product.createdAt
                                        ? new Date(product.createdAt).toLocaleString()
                                        : "—"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Aangepast op</dt>
                                <dd>
                                    {product.updatedAt
                                        ? new Date(product.updatedAt).toLocaleString()
                                        : "—"}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;