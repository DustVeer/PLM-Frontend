import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import LoginPage from "./pages/LoginPage";
import StockPage from "./pages/StockPage";
import FlowPage from "./pages/StockPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  {
    element: <RequireAuth />, // alles hieronder is achter login
    children: [
      { path: "/", element: <StockPage /> },
      { path: "/flowpage", element: <FlowPage /> },
      // meer private routes…
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
