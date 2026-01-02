import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.stubEnv("VITE_API_URL", "http://test-base/api");
