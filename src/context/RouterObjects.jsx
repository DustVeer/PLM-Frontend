import React from "react";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Products from "../pages/Products";
import RequireAuth from "../components/RequireAuth";
import ProductDetails from "../pages/product/ProductDetails";
import AddProduct from "../pages/product/AddProduct";
import Statuses from "../pages/Statuses";
import AddEditStatus from "../pages/status/AddEditStatus";
import Workflows from "../pages/Workflows";
import AddEditWorkflow from "../pages/workflow/AddEditWorkflow";
import ProductCategorySelectPage from "../pages/product/ProductCategorySelectPage";

export const RouterObjects = [
	{
		path: "/login",
		element: <Login />,
	},
	{

		element:
			<RequireAuth>
				<RootLayout />	
			</RequireAuth>,
		children: [
			{ path: "/", element: <Dashboard /> },
			{ path: "/profile", element: <Profile /> },
			{ path: "/products", element: <Products /> },
			{ path: "/products/add", element: <AddProduct /> },
			{ path: "/products/:id", element: <ProductDetails /> },
			{ path: "/products/:id/category", element: <ProductCategorySelectPage /> },
			{ path: "/statuses", element: <Statuses /> },
			{ path: "/statuses/add", element: <AddEditStatus /> },
			{ path: "/statuses/:id/edit", element: <AddEditStatus /> },
			{ path: "/workflows", element: <Workflows /> },
			{ path: "/workflows/new", element: <AddEditWorkflow /> },
			{ path: "/workflows/:id", element: <AddEditWorkflow /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
];
