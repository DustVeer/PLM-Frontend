import { RouterObjects } from "./context/RouterObjects";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ChristmasGarland from "./components/temp/ChristmasGarland";


const router = createBrowserRouter(RouterObjects);


function App() {
    return (
        <AuthProvider>
            <ChristmasGarland />
            <RouterProvider router={router} />
        </AuthProvider>
    );
}

export default App;
