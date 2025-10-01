import React from "react";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import Login from "../pages/Login";
import {AuthProvider} from "../context/AuthContext";

export const RouterObjects = [
	{
		path: "/login",
		element: <Login />,
	},
	{

		element: <RootLayout />,
		children: [
			{ path: "/", element: <Dashboard /> },
			{ path: "/profile", element: <ProfilePage /> },
			{ path: "*", element: <NotFoundPage /> },
		],
	},
];
