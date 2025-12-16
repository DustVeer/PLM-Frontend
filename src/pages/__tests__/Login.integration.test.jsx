// src/pages/__tests__/LoginPage.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../Login.jsx";
import AuthApi from "../../apis/auth.js";
import { AuthProvider } from "../../context/AuthContext.jsx";

const rightUser = {
    email: "user@plm.com",
    password: "plm-password",
};

const wrongUser = {
    email: "wrong@plm.com",
    password: "wrong-password",
};

// Optional: mock react-router's useNavigate if your LoginPage uses it
vi.mock("react-router-dom", async (orig) => {
    const actual = await orig();
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe("LoginPage", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        // Clean localStorage between tests if you store tokens there
        localStorage.clear();
    });

    function renderLogin() {
        return render(
            <MemoryRouter>
                <AuthProvider>
                    <LoginPage />
                </AuthProvider>
            </MemoryRouter>
        );
    }

    it("renders email/username and password fields and a login button", () => {
        renderLogin();

        // Adjust these selectors to match your real labels/placeholders
        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);
        const loginButton = screen.getByRole("button", { name: /login/i });

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(loginButton).toBeInTheDocument();
    });

    it("allows typing into email and password inputs", () => {
        renderLogin();

        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "secret123" } });

        expect(emailInput).toHaveValue("test@example.com");
        expect(passwordInput).toHaveValue("secret123");
    });

    it("calls AuthApi.login with the (right) entered credentials on submit", async () => {
        vi
            .spyOn(AuthApi, "login")
            .mockResolvedValue({ data: { token: "mock-token" } });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);
        const loginButton = screen.getByRole("button", { value: /Login/i });

        fireEvent.change(emailInput, { target: { value: rightUser.email } });
        fireEvent.change(passwordInput, { target: { value: rightUser.password } });

        fireEvent.click(loginButton);

        await waitFor(() => {
            expect(AuthApi.login).toHaveBeenCalledTimes(1);
        });

        expect(AuthApi.login).toHaveBeenCalledWith({
            email: "user@plm.com", // or 'username' depending on your API
            password: "plm-password",
        });
    });



    it("shows an error message when login fails (wrong credentials) status 401", async () => {
        AuthApi.login.mockRejectedValue({
            status: 401,
            response: { data: { message: "Invalid login. Please check your email and password." } },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);
        const loginButton = screen.getByRole("button", { value: /Login/i });

        fireEvent.change(emailInput, { target: { value: wrongUser.email } });
        fireEvent.change(passwordInput, { target: { value: wrongUser.password } });

        fireEvent.click(loginButton);

        // Assuming your component sets an error message from response.data.message
        const errorMessage = await screen.findByText(/Invalid login. Please check your email and password./i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("shows an error message when login fails (Server down) status 501", async () => {
        AuthApi.login.mockRejectedValue({
            status: 501,
            response: { data: { message: "Server is down or unreachable. Please try again later." } },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);
        const loginButton = screen.getByRole("button", { value: /Login/i });

        fireEvent.change(emailInput, { target: { value: rightUser.email } });
        fireEvent.change(passwordInput, { target: { value: rightUser.password } });

        fireEvent.click(loginButton);

        // Assuming your component sets an error message from response.data.message
        const errorMessage = await screen.findByText(/Server is down or unreachable. Please try again later./i);
        expect(errorMessage).toBeInTheDocument();
    });

    it("shows an error message when login fails unknown status", async () => {
        AuthApi.login.mockRejectedValue({
            response: { data: { message: "Cannot reach server. Please check your connection." } },
        });

        renderLogin();

        const emailInput = screen.getByPlaceholderText(/Email/i);
        const passwordInput = screen.getByPlaceholderText(/Wachtwoord/i);
        const loginButton = screen.getByRole("button", { value: /Login/i });

        fireEvent.change(emailInput, { target: { value: rightUser.email } });
        fireEvent.change(passwordInput, { target: { value: rightUser.password } });

        fireEvent.click(loginButton);

        // Assuming your component sets an error message from response.data.message
        const errorMessage = await screen.findByText(/Cannot reach server. Please check your connection./i);
        expect(errorMessage).toBeInTheDocument();
    });
});
