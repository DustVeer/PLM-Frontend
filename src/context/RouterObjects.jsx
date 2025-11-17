import React from "react";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import Login from "../pages/Login";
import Products from "../pages/Products";
import RequireAuth from "../components/RequireAuth";
import ProductDetails from "../pages/product/ProductDetails";
import AddProduct from "../pages/product/AddProduct";

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
			{ path: "/profile", element: <ProfilePage /> },
			{ path: "/products", element: <Products /> },
			{ path: "/products/:id", element: <ProductDetails /> },
			{ path: "/products/add", element: <AddProduct /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
];
