import { Outlet } from "react-router-dom";
import { SidebarProvider } from "../context/SidebarContext";
import Header from "../components/Header";
import Sidebar from "../components/SideBar";

export default function RootLayout() {


    return (
        <SidebarProvider>
            <Header />
            <div className="pt-16 lg:mx-16 md:mx-auto max-w-full flex">
                <Sidebar />
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
}
