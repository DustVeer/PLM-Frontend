import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductsApi from "../../apis/products";
import CategoriesApi from "../../apis/categories";

const PAGE_SIZE = 20;

function ProductCategorySelectPage() {
    const { id } = useParams(); // product id from route
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedTerm, setDebouncedTerm] = useState("");

    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [loadingProduct, setLoadingProduct] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Load product (mainly to show current category)
    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoadingProduct(true);
                const p = await ProductsApi.getById(id);
                setProduct(p);
            } catch (err) {
                setError("Failed to load product.");
            } finally {
                setLoadingProduct(false);
            }
        }

        fetchProduct();
    }, [id]);

    // Debounce search input
    useEffect(() => {
        const handle = setTimeout(() => {
            setDebouncedTerm(searchTerm);
            setPage(1);
            setHasMore(true);
        }, 400);

        return () => clearTimeout(handle);
    }, [searchTerm]);

    // Fetch categories on debouncedTerm or page change
    useEffect(() => {
        async function fetchCategories() {
            if (!hasMore && page !== 1) return;

            setLoadingCategories(true);
            setError(null);

            try {
                const response = await CategoriesApi.searchByName({
                    searchString: debouncedTerm,
                    page,
                    pageSize: PAGE_SIZE,
                });

                const items = response.items || [];

                setCategories((prev) => (page === 1 ? items : [...prev, ...items]));

                const isLast =
                    typeof response.last === "boolean"
                        ? response.last
                        : items.length < PAGE_SIZE;

                setHasMore(!isLast);
            } catch (err) {
                setError("Failed to load categories.");
            } finally {
                setLoadingCategories(false);
            }
        }

        fetchCategories();
    }, [debouncedTerm, page, hasMore]);

    // When user picks a category
    async function handleSelectCategory(category) {
        if (!category || saving || !product) return;

        setSaving(true);
        setError(null);

        try {
            const updated = await ProductsApi.update(id, {
                name: product.name,
                description: product.description,
                categoryId: category.id,
                statusId: product.productStatus?.id,
                updatedById: product.updatedBy?.id ?? product.createdBy?.id,
                colour: product.colour,
            });

            setProduct(updated);
            navigate(`/products/${id}`);
        } catch (err) {
            setError("Failed to update product category.");
        } finally {
            setSaving(false);
        }
    }

    const isSelectedCategory = (cat) =>
        product?.productCategory?.id === cat.id;

    return (
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-indigo-600 hover:underline hover:cursor-pointer"
            >
                ← Back to product
            </button>

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Assign category to product
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Search and select a category. Only a limited number of categories
                        are loaded at a time.
                    </p>
                </div>
                
            </div>

            {/* Product summary */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Product
                    </p>
                    {loadingProduct ? (
                        <p className="mt-1 text-sm text-gray-500">Loading product...</p>
                    ) : product ? (
                        <>
                            <p className="mt-1 text-base font-semibold text-gray-900">
                                {product.name}
                            </p>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {product.description || "No description available."}
                            </p>
                        </>
                    ) : (
                        <p className="mt-1 text-sm text-red-500">
                            Product could not be loaded.
                        </p>
                    )}
                </div>
                <div className="sm:text-right">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Current category
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                        {product?.productCategory?.name || "No category assigned"}
                    </p>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="border border-red-300 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {typeof error === "string" ? error : error.message}
                </div>
            )}

            {/* Search + table card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
                {/* Card header with search */}
                <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Categories</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Use the search bar to filter categories. Results are loaded
                            with pagination.
                        </p>
                    </div>
                    <div className="w-full sm:w-72">
                        <label className="sr-only">Search categories</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <span className="absolute inset-y-0 left-2 flex items-center text-gray-400 text-sm">
                                🔍
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table wrapper */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    ID
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Name
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Status
                                </th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.length === 0 && !loadingCategories && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        No categories found. Try a different search term.
                                    </td>
                                </tr>
                            )}

                            {categories.map((cat) => (
                                <tr
                                    key={cat.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-4 py-2 text-gray-500 align-middle">
                                        {cat.id}
                                    </td>
                                    <td className="px-4 py-2 text-gray-900 font-medium align-middle">
                                        {cat.name}
                                    </td>
                                    <td className="px-4 py-2 align-middle">
                                        {isSelectedCategory(cat) ? (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                                                Selected
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                                                Available
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right align-middle">
                                        <button
                                            type="button"
                                            disabled={saving || isSelectedCategory(cat)}
                                            onClick={() => handleSelectCategory(cat)}
                                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isSelectedCategory(cat)
                                                    ? "border-gray-300 text-gray-500 bg-gray-50 cursor-default"
                                                    : "btn-blue"
                                                }`}
                                        >
                                            {isSelectedCategory(cat) ? "Selected" : "Select"}
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {loadingCategories && (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-4 text-center text-sm text-gray-500"
                                    >
                                        Loading categories...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table footer with pagination */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
                    <p className="text-xs text-gray-500">
                        {categories.length > 0
                            ? `Showing ${categories.length} result(s)${hasMore ? " (more available)" : ""
                            }`
                            : "No results to display."}
                    </p>

                    {hasMore && categories.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={loadingCategories}
                            className="btn-cancel"
                        >
                            {loadingCategories ? "Loading..." : "Load more"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductCategorySelectPage;
