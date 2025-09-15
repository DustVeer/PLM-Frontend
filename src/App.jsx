import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

function App() {
  return <AuthProvider></AuthProvider>;
}

export default App;
