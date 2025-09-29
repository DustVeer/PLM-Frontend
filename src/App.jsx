import React, { use } from "react";
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProductsApi from "./api's/products";
import RequireAuth from "./auth/RequireAuth";
import LoginPage from "./pages/LoginPage";
import StockPage from "./pages/StockPage";
import FlowPage from "./pages/StockPage";

// const router = createBrowserRouter([
//   { path: "/login", element: <LoginPage /> },
//   {
//     element: <RequireAuth />, // alles hieronder is achter login
//     children: [
//       { path: "/", element: <StockPage /> },
//       { path: "/flowpage", element: <FlowPage /> },
//       // meer private routes…
//     ],
//   },
// ]);

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const requestData = async () => {
      try{
        const response = await ProductsApi.list();
        setProducts(JSON.stringify(response));
      }
      catch(error){
        console.error('Error fetching products:', error);
      }
      };
    requestData();

    }
    , [])

  return (
    <AuthProvider>
      <p>{products}</p>
    </AuthProvider>
  );
}

export default App;
