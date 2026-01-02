import { describe, it, expect, vi, beforeEach } from "vitest";

// IMPORTANT: mock AuthContext BEFORE importing the module under test
vi.mock("../../context/AuthContext", () => ({
    getStoredToken: vi.fn(() => "mock-token"),
}));

// Mock fetch globally
global.fetch = vi.fn();

function mockFetchResponse({
    ok = true,
    status = 200,
    contentType = "application/json",
    jsonData = null,
    textData = "",
} = {}) {
    return {
        ok,
        status,
        headers: {
            get: (key) => (key?.toLowerCase() === "content-type" ? contentType : null),
        },
        json: jsonData
            ? vi.fn(async () => jsonData)
            : vi.fn(async () => {
                throw new Error("no json");
            }),
        text: vi.fn(async () => textData),
    };
}

describe("api request wrapper (unit)", async () => {
    let api;
    let ApiError;
    let getStoredToken;

    beforeEach(async () => {
        vi.clearAllMocks();

        const clientModule = await import("../client.js");
        api = clientModule.api;
        ApiError = clientModule.ApiError;

        // Access the mocked getStoredToken for assertions
        const auth = await import("../../context/AuthContext");
        getStoredToken = auth.getStoredToken;
    });

    it("adds Authorization header with Bearer token and Content-Type JSON", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({ ok: true, jsonData: { success: true } })
        );

        const result = await api.get("/products");

        expect(result).toEqual({ success: true });

        expect(getStoredToken).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledTimes(1);

        const [url, options] = fetch.mock.calls[0];

        expect(url).toBe("http://test-base/api/products");
        expect(options.headers["Content-Type"]).toBe("application/json");
        expect(options.headers.Authorization).toBe("Bearer mock-token");
    });


    it("builds query string from options.params", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({ ok: true, jsonData: { ok: 1 } })
        );

        await api.get("/categories/search", {
            params: { searchString: "shoe", page: 1, pageSize: 20 },
        });

        const [url] = fetch.mock.calls[0];

        // Order of query params from URLSearchParams can vary; check substrings
        expect(url).toContain("http://test-base/api/categories/search?");
        expect(url).toContain("searchString=shoe");
        expect(url).toContain("page=1");
        expect(url).toContain("pageSize=20");
    });

    it("POST sends JSON stringified body and method POST", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({ ok: true, jsonData: { created: true } })
        );

        await api.post("/products", { name: "Test" });

        const [url, options] = fetch.mock.calls[0];
        expect(url).toBe("http://test-base/api/products");
        expect(options.method).toBe("POST");
        expect(options.body).toBe(JSON.stringify({ name: "Test" }));
    });

    it("PUT sends JSON stringified body and method PUT", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({ ok: true, jsonData: { updated: true } })
        );

        await api.put("/products/1", { name: "Updated" });

        const [, options] = fetch.mock.calls[0];
        expect(options.method).toBe("PUT");
        expect(options.body).toBe(JSON.stringify({ name: "Updated" }));
    });

    it("DELETE uses method DELETE", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({ ok: true, jsonData: { deleted: true } })
        );

        await api.del("/products/1");

        const [, options] = fetch.mock.calls[0];
        expect(options.method).toBe("DELETE");
    });

    it("throws ApiError('Network error') when fetch throws", async () => {
        fetch.mockRejectedValue(new Error("boom"));

        await expect(api.get("/products")).rejects.toMatchObject({
            name: "ApiError",
            message: "Network error",
            status: 0,
            body: null,
        });
    });

    it("throws ApiError with JSON message when response is not ok and JSON contains message", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({
                ok: false,
                status: 401,
                jsonData: { message: "Invalid credentials" },
            })
        );

        await expect(api.get("/secure")).rejects.toMatchObject({
            name: "ApiError",
            message: "Invalid credentials",
            status: 401,
            body: { message: "Invalid credentials" },
        });
    });

    it("throws ApiError with JSON error when response is not ok and JSON contains error", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({
                ok: false,
                status: 400,
                jsonData: { error: "Bad request" },
            })
        );

        await expect(api.get("/bad")).rejects.toMatchObject({
            message: "Bad request",
            status: 400,
        });
    });

    it("throws ApiError with text message when response is not ok and content-type is text/plain", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({
                ok: false,
                status: 500,
                contentType: "text/plain",
                textData: "Server exploded",
            })
        );

        await expect(api.get("/oops")).rejects.toMatchObject({
            message: "Server exploded",
            status: 500,
            body: "Server exploded",
        });
    });

    it("returns text payload when content-type is not JSON", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({
                ok: true,
                status: 200,
                contentType: "text/plain",
                textData: "hello",
            })
        );

        await expect(api.get("/ping")).resolves.toBe("hello");
    });

    it("falls back to `HTTP <status>` when error body has no message", async () => {
        fetch.mockResolvedValue(
            mockFetchResponse({
                ok: false,
                status: 404,
                contentType: "application/json",
                jsonData: {}, // no message/error
            })
        );

        await expect(api.get("/missing")).rejects.toMatchObject({
            message: "HTTP 404",
            status: 404,
        });
    });
});
