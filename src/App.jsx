import { RouterObjects } from "./context/RouterObjects";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


const router = createBrowserRouter(RouterObjects, {basename:"/PLM-Frontend"});


function App() {
    return (
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
