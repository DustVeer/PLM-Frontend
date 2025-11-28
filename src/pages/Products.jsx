import ProductsApi from "../apis/products";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusPillSmall from "../components/StatusPillSmall";

function Products() {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchProducts() {
            const data = await ProductsApi.list();
            setProducts(data);
        }
        fetchProducts();
    }, []);


    return (
        <>
            <main className="flex-1 p-4 bg-white rounded-xl shadow-lg animate-fade-in">
                <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">Product List</h2>
                    <div className="flex mb-2">
                        <div className="flex items-center gap-3">

                            <input
                                type="text"
                                placeholder="Search for product..."
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <input
                                type="date"
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                                Filter
                            </button>
                        </div>
                        <div className="ml-auto">
                            <button
                                onClick={() => navigate("/products/add")}
                                className="btn-green"
                            >
                                + Add Product
                            </button>
                        </div>

                    </div>
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">#</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Categorie</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Created At</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Updated At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product, index) => (
                                    <tr key={product.id} onClick={() => navigate(`/products/${product.id}`)} className="hover:bg-indigo-200 hover:cursor-pointer transition-colors duration-100">
                                        <td className="px-6 py-3 text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700">{product.name}</td>
                                       
                                        <td className="p-3 flex justify-start align-start">
                                            <StatusPillSmall
                                                label={product.statusName}
                                                color={product.statusColorHex}
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-sm text-gray-700">{product.categoryName}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700">{product.description}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700">{product.createdAt}</td>
                                        <td className="px-6 py-3 text-sm text-gray-700">{product.updatedAt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main >
        </>
    )
}

export default Products;