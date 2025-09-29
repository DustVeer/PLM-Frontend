import React, { use } from "react";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import { SidebarProvider } from "./context/SidebarContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";


function App() {
  

  return (
    <>
      <Login />
      {/* <SidebarProvider>
        <div className="min-h-screen overflow-x-hiddenoverlay fixed inset-0z-40 hidden opacity-0 transition-opacity duration-300"></div>
        <Header />
        <div className="pt-16 max-w-7xl mx-auto flex">
          <Sidebar />
          <Dashboard />
        </div>  
      </SidebarProvider> */}
    </>

  );
}

export default App;
