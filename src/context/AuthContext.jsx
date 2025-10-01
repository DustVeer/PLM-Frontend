import { createContext, useContext, useEffect, useMemo, useState } from "react";
import AuthApi from "../apis/auth";

const TOKEN_KEY = "accessToken";
const AuthContext = createContext(null);

function getStoredToken() {
    // Prefer localStorage, fall back to sessionStorage
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY) ?? null;
}

function setStoredToken(token, remember) {
    // Store in the chosen storage and remove from the other
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    target.setItem(TOKEN_KEY, token);
    other.removeItem(TOKEN_KEY);
}

function clearStoredToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => getStoredToken());

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

        console.log(res);

        // surface any backend message
        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || `Login failed (${res.status})`);
        }


        const data = await res.json();

        console.log(data);

        const receivedToken = data.token;

        if (!receivedToken) {
            throw new Error("Token not found in response.");
        }

        setToken(receivedToken);
        setStoredToken(receivedToken, !!remember);
        return receivedToken;
    }

    function logout() {
        clearStoredToken();
        setToken(null);
    }

    const value = useMemo(
        () => ({ token, isAuthenticated: !!token, login, logout }),
        [token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
    return ctx;
}
