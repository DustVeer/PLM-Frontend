import React from "react";
import RootLayout from "../layouts/RootLayout";
import Dashboard from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import Login from "../pages/Login";
import {AuthProvider} from "../context/AuthContext";
import RequireAuth from "../components/RequireAuth";

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
			{ path: "*", element: <NotFoundPage /> },
		],
	},
];
