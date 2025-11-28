import React, { useEffect, useState } from "react";
// Adjust these imports to your actual API modules
// import { ProductApi, CategoryApi, ProductStatusApi, WorkflowApi } from "../api";


export default function AddProductPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    statusId: "",
    workflowId: "",
    colour: "",
    price: "",
  });

  const [categories, setCategories] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [workflows, setWorkflows] = useState([]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Replace with your real API calls
    // CategoryApi.list().then(setCategories).catch(console.error);
    // ProductStatusApi.list().then(setStatuses).catch(console.error);
    // WorkflowApi.list().then(setWorkflows).catch(console.error);

    // Temporary mock data so the page works visually
    setCategories([
      { id: 1, name: "Sneakers" },
      { id: 2, name: "Boots" },
      { id: 3, name: "Sandals" },
    ]);

    setStatuses([
      { id: 1, name: "Draft" },
      { id: 2, name: "Sample" },
      { id: 3, name: "Approved" },
    ]);

    setWorkflows([
      { id: 1, name: "Default Workflow" },
      { id: 2, name: "Fast Track" },
    ]);
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.categoryId) newErrors.categoryId = "Category is required";
    if (!form.statusId) newErrors.statusId = "Status is required";
    if (!form.price) newErrors.price = "Price is required";

    return newErrors;
  }

  async function handleSubmit(edit) {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);

    try {
      const body = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        categoryId: Number(form.categoryId),
        statusId: Number(form.statusId),
        workflowId: form.workflowId ? Number(form.workflowId) : null,
        colour: form.colour.trim() || null,
        price: Number(form.price),
        // createdById / updatedById can be filled from the backend using the JWT user
      };

      // Replace with your real API call, for example:
      // await ProductApi.create(body);

      console.log("Submitting product:", body);

      setSuccessMessage("Product created successfully.");
      setForm({
        name: "",
        description: "",
        categoryId: "",
        statusId: "",
        workflowId: "",
        colour: "",
        price: "",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        submit: "Something went wrong while creating the product.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderOptions(items) {
    return items.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ));
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]  dark:bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
              Products /{" "}
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Add product
              </span>
            </p>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              New product
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Fill in the details below to add a new product to Poelman PLM.
            </p>
          </div>
        </div>

        {/* Alerts */}
        {successMessage && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            {successMessage}
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
            {errors.submit}
          </div>
        )}

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 px-6 py-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Name<span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Leather Chelsea boot"
                className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.name
                    ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-rose-500">{errors.name}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Category<span className="text-rose-500">*</span>
              </label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.categoryId
                    ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <option value="">Select category…</option>
                {renderOptions(categories)}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.categoryId}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Status<span className="text-rose-500">*</span>
              </label>
              <select
                name="statusId"
                value={form.statusId}
                onChange={handleChange}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.statusId
                    ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              >
                <option value="">Select status…</option>
                {renderOptions(statuses)}
              </select>
              {errors.statusId && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.statusId}
                </p>
              )}
            </div>

            {/* Workflow */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Workflow
              </label>
              <select
                name="workflowId"
                value={form.workflowId}
                onChange={handleChange}
                className="w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">No workflow</option>
                {renderOptions(workflows)}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Price (€)<span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g. 79.95"
                className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 ${
                  errors.price
                    ? "border-rose-400 focus:ring-rose-500 focus:border-rose-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
              />
              {errors.price && (
                <p className="mt-1 text-xs text-rose-500">{errors.price}</p>
              )}
            </div>

            {/* Colour */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Colour
              </label>
              <input
                type="text"
                name="colour"
                value={form.colour}
                onChange={handleChange}
                placeholder="e.g. Black"
                className="w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Short description of the product, materials, fit, etc."
              className="w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="btn-cancel inline-flex"
            >
              <span className="material-icons-outlined text-base">
                arrow_back
              </span>
              Back to list
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-green inline-flex items-center"
            >
              <span className="material-icons-outlined text-base">
                {isSubmitting ? "hourglass_top" : "add"}
              </span>
              {isSubmitting ? "Saving…" : "Save product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
