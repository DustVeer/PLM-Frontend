import { getStoredToken } from "../context/AuthContext";

const BASE_URL = "http://localhost:8080/api";

export class ApiError extends Error {
    constructor(message, status, body) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

async function request(path, options = {}) {
    const token = getStoredToken(); 
    let res;
    console.log("path", path);
    console.log("options", options);

    let url = `${BASE_URL}${path}`;
    if (options.params) {
        const qs = new URLSearchParams(options.params).toString();
        url += `?${qs}`;
    }

    try {
        res = await fetch(url, {
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, ...(options.headers || {}) },
            ...options,
        })
    }
    catch {
        throw new ApiError("Network error", 0, null);
    }

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const payload = isJson ? await res.json().catch(() => null)
        : await res.text().catch(() => "");

    if (!res.ok) {
        const msg =
            (isJson ? payload?.message || payload?.error : payload) ||
            `HTTP ${res.status}`;
        throw new ApiError(msg, res.status, payload);
    }

    return payload;

}

export const api = {
    get: (path, options) => request(path, options),
    post: (path, body) =>
        request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) =>
        request(path, { method: "PUT", body: JSON.stringify(body) }),
    del: (path) => request(path, { method: "DELETE" }),
};
