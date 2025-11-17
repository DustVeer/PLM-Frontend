import { useSidebar } from "../context/SidebarContext";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { isOpen } = useSidebar();
    const {logout } = useAuth();
    
    const handleLogOut = () => {
        logout();
    };
    return (
        <>
            <aside className={`fixed top-16 left-0 bottom-0 lg:static w-[240px] bg-indigo-50overflow-y-auto p-4 transition-transform duration-300z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="bg-white rounded-xl shadow-lg mb-6 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Link to="/" className="flex items-center text-gray-600 hover:text-indigo-800 py-4 transition-all duration-300 hover:translate-x-1">
                        <span className="material-icons-outlined mr-2">dashboard</span>
                        Dashboard
                        <span className="material-icons-outlined ml-auto">keyboard_arrow_right</span>
                    </Link>
                    <Link to="/products" className="flex items-center text-gray-600 hover:text-indigo-800 py-4 transition-all duration-300 hover:translate-x-1">
                        <span className="material-icons-outlined mr-2">tune</span>
                        Producten
                        <span className="material-icons-outlined ml-auto">keyboard_arrow_right</span>
                    </Link>
                    <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800 py-4 transition-all duration-300 hover:translate-x-1">
                        <span className="material-icons-outlined mr-2">file_copy</span>
                        Another menu item
                        <span className="material-icons-outlined ml-auto">keyboard_arrow_right</span>
                    </a>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <Link to="/profile" className="flex items-center text-gray-600 hover:text-indigo-800 py-4 transition-all duration-300 hover:translate-x-1">
                        <span className="material-icons-outlined mr-2">face</span>
                        Profiel
                        <span className="material-icons-outlined ml-auto">keyboard_arrow_right</span>
                    </Link>
                    <a href="#" className="flex items-center text-gray-600 hover:text-indigo-800 py-4 transition-all duration-300 hover:translate-x-1">
                        <span className="material-icons-outlined mr-2">settings</span>
                        Settings
                        <span className="material-icons-outlined ml-auto">keyboard_arrow_right</span>
                    </a>
                    <a onClick={handleLogOut} className="flex items-center hover:cursor-pointer text-gray-600 hover:text-indigo-800 py-4 transition-all duration-300 hover:translate-x-1">
                        <span className="material-icons-outlined mr-2">power_settings_new</span>
                        Log out
                        <span className="material-icons-outlined ml-auto">keyboard_arrow_right</span>
                    </a>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;