import { useSidebar } from "../context/SidebarContext";

function Header() {
    const { toggle } = useSidebar();
    
    return (
        <>
            <header className="fixed w-full bg-white text-indigo-800 z-50 shadow-lg animate-slide-down ">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between h-16">
                    <button className="mobile-menu-button p-2 lg:hidden" onClick={toggle}>
                        <span className="material-icons-outlined text-2xl">menu</span>
                    </button>
                    <div className="text-xl font-bold text-indigo-800">
                        Poelman PLM
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="material-icons-outlined p-2 text-2xl cursor-pointer hover:text-indigo-800 transition-transform duration-300 hover:scale-110 hidden md:block ">notifications</span>
                        
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;