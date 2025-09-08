import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import SideBar from "./components/SideBar.jsx";
import Header from "./components/Header.jsx";
import StockPage from "./pages/StockPage.jsx";
import ProductCard from "./components/ProductCard.jsx";
import ProductStatusFlow from "./pages/FlowPage.jsx";

function App() {
  const products = [
    { id: 1, name: "Apple", price: "2,99" },
    { id: 2, name: "Pear", price: "1,99" },
    { id: 3, name: "Shoe", price: "5,99" },
    { id: 4, name: "Drink", price: "4,99" },
  ];

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        <SideBar />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Header />
          <ProductStatusFlow />
          {/* <ProductCard /> */}
        </div>
      </div>
    </>
  );
}

function TableBody({ product }) {
  return (
    <tr onClick={() => alert("test")}>
      <td className="px-6 py-3 text-sm text-gray-800">{product.id}</td>
      <td className="px-6 py-3 text-sm text-gray-800">{product.name}</td>
      <td className="px-6 py-3 text-sm text-gray-800">{product.price}</td>
    </tr>
  );
}

export default App;
