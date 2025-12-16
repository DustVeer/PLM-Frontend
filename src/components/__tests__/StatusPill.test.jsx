// src/components/__tests__/StatusPill.test.jsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusPill from "../productPages/StatusPill.jsx";

describe("StatusPill", () => {
    it("returns null when no status is provided", () => {
        const { container } = render(<StatusPill status={null} />);

        expect(container.firstChild).toBeNull();
    });

    it("renders the status name when provided", () => {
        const status = {
            name: "In Design",
            statusColorHex: "#22c55e",
            description: "Design phase",
        };

        render(<StatusPill status={status} isCurrent={true} isBehind={false} />);

        expect(screen.getByTestId("status-pill")).toBeInTheDocument();
        expect(screen.getByText("In Design")).toBeInTheDocument();
    });

    it("falls back to 'Unknown status' when name is missing", () => {
        const status = {
            name: null,
            statusColorHex: "#22c55e",
            description: "Some description",
        };

        render(<StatusPill status={status} isCurrent={true} isBehind={false} />);

        expect(screen.getByText("Unknown status")).toBeInTheDocument();
    });

    it("uses the status color when isCurrent is true", () => {
        const status = {
            name: "In Progress",
            statusColorHex: "#123456",
            description: "In progress",
        };

        render(<StatusPill status={status} isCurrent={true} isBehind={false} />);

        const pill = screen.getByTestId("status-pill");
        expect(pill).toHaveStyle({ backgroundColor: "#123456" });
    });

    it("uses the status color when isBehind is true", () => {
        const status = {
            name: "Behind",
            statusColorHex: "#ff0000",
            description: "Behind schedule",
        };

        render(<StatusPill status={status} isCurrent={false} isBehind={true} />);

        const pill = screen.getByTestId("status-pill");
        expect(pill).toHaveStyle({ backgroundColor: "#ff0000" });
        expect(pill.className).toContain("opacity-40");
    });

    it("uses the default grey when neither isCurrent nor isBehind", () => {
        const status = {
            name: "Planned",
            statusColorHex: "#22c55e",
            description: "Planned phase",
        };

        render(<StatusPill status={status} isCurrent={false} isBehind={false} />);

        const pill = screen.getByTestId("status-pill");
        expect(pill).toHaveStyle({ backgroundColor: "#E5E7EB" });
    });

    it("shows the status description in the tooltip when provided", () => {
        const status = {
            name: "Approved",
            statusColorHex: "#22c55e",
            description: "Approved by management",
        };

        render(<StatusPill status={status} isCurrent={true} isBehind={false} />);

        const tooltip = screen.getByTestId("status-tooltip");
        expect(tooltip).toBeInTheDocument();
        expect(screen.getByText("Approved by management")).toBeInTheDocument();
        expect(screen.getByText("Click to set status")).toBeInTheDocument();
    });

    it("falls back to default tooltip text when description is missing", () => {
        const status = {
            name: "Pending",
            statusColorHex: "#f97316",
            description: "",
        };

        render(<StatusPill status={status} isCurrent={false} isBehind={false} />);

        expect(screen.getByText("No description available.")).toBeInTheDocument();
    });
});
