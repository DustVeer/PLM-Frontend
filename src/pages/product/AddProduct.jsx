// src/pages/product/AddProductPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductsApi from "../../apis/products";
import { getStoredUser } from "../../context/AuthContext";

export default function AddProduct() {
	const navigate = useNavigate();
	const currentUser = JSON.parse(getStoredUser());

	const [form, setForm] = useState({
		name: "",
		description: "",
		productCategoryId: "",
		productStatusId: "",
		createdBy: currentUser ? currentUser.userId : "",
	});

	const [error, setError] = useState(null);
	const [saving, setSaving] = useState(false);


	function handleChange(e) {
		setForm({
			...form,
			[e.target.name]: e.target.value,
		});
		console.log("Form", form);
		
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setSaving(true);
		setError(null);
		
		console.log("Submitting form", form);

		try {

			const created = await ProductsApi.create({
				name: form.name,
				description: form.description,
				categoryId: parseInt(form.productCategoryId),
				statusId: parseInt(form.productStatusId),
				createdBy: form.createdBy
			});

			navigate(`/products/${created.id}`);
		} catch (err) {
			setError(err.message || "Failed to save product");
		} finally {
			setSaving(false);
		}
	}


	return (
		<div className="p-8 max-w-3xl mx-auto space-y-8 bg-white rounded-xl shadow-lg">
			<button
				onClick={() => navigate(-1)}
				className="text-link"
			>
				← Back to Products
			</button>

			<h1 className="text-2xl font-bold text-gray-900">Create New Product</h1>

			{error && (
				<div className="rounded-lg bg-red-50 text-red-700 p-3 text-sm">
					{error}
				</div>
			)}

			<form className="space-y-6" onSubmit={handleSubmit}>
				{/* Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Product Name
					</label>
					<input
						type="text"
						name="name"
						value={form.name}
						onChange={handleChange}
						required
						className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>

				{/* Description */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Description
					</label>
					<textarea
						name="description"
						value={form.description}
						onChange={handleChange}
						rows="4"
						className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 max-h-96 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
						className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1 "
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
						className="ps-1 py-1 mt-1 w-full rounded-md border-indigo-900 border-1  shadow-sm"
					/>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={saving}
					className="btn-green "
				>
					{saving ? "Saving..." : "Save Product"}
				</button>
			</form>
		</div>
	);
}
