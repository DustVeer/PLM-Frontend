import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Products from "../Products.jsx";
import ProductsApi from "../../apis/products.js";

// Mock useNavigate so we can assert navigation calls
const mockNavigate = vi.fn();

const mockProducts = [
    {
        id: 1,
        name: "Basic Sneaker",
        statusName: "In Design",
        statusColorHex: "#22c55e",
        categoryName: "Sneakers",
        description: "White low-top sneaker",
        createdAt: "2025-01-01",
        updatedAt: "2025-01-10",
    },
    {
        id: 2,
        name: "Leather Boot",
        statusName: "Approved",
        statusColorHex: "#0ea5e9",
        categoryName: "Boots",
        description: "Black leather boot",
        createdAt: "2025-01-05",
        updatedAt: "2025-01-12",
    },
]

vi.mock("react-router-dom", async (orig) => {
    const actual = await orig();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe("Products page", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        mockNavigate.mockReset();
    });

    function renderProducts() {
        return render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );
    }

    it("fetches products on mount and renders them in the table", async () => {
        const listSpy = vi
            .spyOn(ProductsApi, "list")
            .mockResolvedValue(mockProducts);

        renderProducts();

        // Verify API was called
        expect(listSpy).toHaveBeenCalledTimes(1);

        // Wait for first product to appear in the DOM
        const firstProductRowCell = await screen.findByText("Basic Sneaker");
        expect(firstProductRowCell).toBeInTheDocument();
        expect(screen.getByText("Leather Boot")).toBeInTheDocument();

        // Check other fields rendered
        expect(screen.getByText("In Design")).toBeInTheDocument();
        expect(screen.getByText("Approved")).toBeInTheDocument();
        expect(screen.getByText("Sneakers")).toBeInTheDocument();
        expect(screen.getByText("Boots")).toBeInTheDocument();
        expect(screen.getByText("White low-top sneaker")).toBeInTheDocument();
        expect(screen.getByText("Black leather boot")).toBeInTheDocument();
        expect(screen.getByText("2025-01-01")).toBeInTheDocument();
        expect(screen.getByText("2025-01-12")).toBeInTheDocument();
    });

    it("renders an empty table body when no products are returned", async () => {
        vi.spyOn(ProductsApi, "list").mockResolvedValue([]);

        renderProducts();

        await waitFor(() => {
            // There should be no product names present
            const bodyRows = document.querySelectorAll("tbody tr");
            expect(bodyRows.length).toBe(0);
        });
    });

    it("navigates to the add product page when clicking '+ Add Product'", async () => {
        vi.spyOn(ProductsApi, "list").mockResolvedValue([]);

        renderProducts();

        const addButton = screen.getByRole("button", { name: /\+ Add Product/i });
        fireEvent.click(addButton);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith("/products/add");
    });

    it("navigates to the product details page when clicking a row", async () => {
        const mockProduct = mockProducts[0];

        vi.spyOn(ProductsApi, "list").mockResolvedValue(mockProducts);

        renderProducts();

        // Wait for row content
        const nameCell = await screen.findByText(mockProduct.name);
        const row = nameCell.closest("tr");
        expect(row).not.toBeNull();

        fireEvent.click(row);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(`/products/${mockProduct.id}`);
    });
});
