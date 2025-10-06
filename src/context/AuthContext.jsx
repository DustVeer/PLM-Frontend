import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthApi from "../apis/auth";

const TOKEN_KEY = "accessToken";
const USER_KEY = "currentUser";

const AuthContext = createContext(null);

function getStoredToken() {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? null;
}

function setStoredToken(token, remember) {
    // Store in the chosen storage and remove from the other
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    target.setItem(TOKEN_KEY, token);
    other.removeItem(TOKEN_KEY);
}

//Saves the user just like the token functions
function getStoredUser() {
    return localStorage.getItem(USER_KEY) ?? sessionStorage.getItem(USER_KEY) ?? null;
}

function setStoredUser(user, remember) {
    // Store in the chosen storage and remove from the other
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    target.setItem(USER_KEY, user);
    other.removeItem(USER_KEY);
}


function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

function clearStoredUser() {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => getStoredToken());
    const [user, setUser] = useState(() => getStoredUser());


    useEffect(() => {
        // Keep state in sync if another tab logs in/out
        const handler = () => setToken(getStoredToken());
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    async function login(email, password, remember) {
        // call your backend to login
        // and get a token (JWT)
        // Here we assume the token is in res.data.token
        // Adjust according to your backend API

        const res = await AuthApi.login({ email, password });

        const receivedToken = res.token;
        const user = {userId: res.userId, name: res.userName, email: res.userEmail, role: res.userRoleResponse};

        if (!receivedToken) {
            throw new Error("Token not found in response.");
        }

        setToken(receivedToken);
        setUser(JSON.stringify(user));
        setStoredToken(receivedToken, !!remember);
        setStoredUser(JSON.stringify(user), !!remember); //saves the user
        return receivedToken;
    }

    function logout() {
        clearStoredToken();
        clearStoredUser();
        setToken(null);
    }

    const value = useMemo(
        () => ({ token, user, isAuthenticated: !!token, login, logout }),
        [token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
