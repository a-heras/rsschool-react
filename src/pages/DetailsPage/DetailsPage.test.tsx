import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { DetailsPage } from "./DetailsPage";
import { loadDetails } from "../../api/api";

vi.mock("../../api/api");

const loadDetailsMock = vi.mocked(loadDetails);

describe("DetailsPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading state initially", () => {
        loadDetailsMock.mockReturnValue(new Promise(() => {}));

        render(<DetailsPage itemId="1" />);

        expect(loadDetailsMock).toHaveBeenCalledWith("1");
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("renders details after successful load", async () => {
        loadDetailsMock.mockResolvedValue({
            id: 1,
            name: "Test Item",
            description: "Some description",
        });

        render(<DetailsPage itemId="1" />);

        expect(loadDetailsMock).toHaveBeenCalledWith("1");
        expect(await screen.findByText("Test Item")).toBeInTheDocument();
        expect(screen.getByText("Some description")).toBeInTheDocument();
        expect(screen.getByText("Item #1")).toBeInTheDocument();
    });

    it("shows error message on failure", async () => {
        loadDetailsMock.mockRejectedValue(new Error("fail"));

        render(<DetailsPage itemId="1" />);

        expect(loadDetailsMock).toHaveBeenCalledWith("1");
        expect(
            await screen.findByText("Failed to load details.")
        ).toBeInTheDocument();
    });
});
