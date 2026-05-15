import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { DetailsPage } from "./DetailsPage";
import { loadDetails } from "../../api/api";
import type { Item } from "../../types/item";

vi.mock("../../api/api");

const loadDetailsMock = vi.mocked(loadDetails);

const itemOne: Item = {
    id: 1,
    name: "Test Item",
    description: "Some description",
};

const itemTwo: Item = {
    id: 2,
    name: "Second Item",
    description: "Another description",
};

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
        loadDetailsMock.mockResolvedValue(itemOne);

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

    it("hides loading after data is loaded", async () => {
        loadDetailsMock.mockResolvedValue(itemOne);

        render(<DetailsPage itemId="1" />);

        await screen.findByText("Test Item");

        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it("does not render item content when load fails", async () => {
        loadDetailsMock.mockRejectedValue(new Error("fail"));

        render(<DetailsPage itemId="1" />);

        await screen.findByText("Failed to load details.");

        expect(screen.queryByText("Item #1")).not.toBeInTheDocument();
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    it("renders content inside details-panel", async () => {
        loadDetailsMock.mockResolvedValue(itemOne);

        const { container } = render(<DetailsPage itemId="1" />);

        await screen.findByText("Test Item");

        expect(container.querySelector(".details-panel")).toBeInTheDocument();
        expect(container.querySelector(".details-container")).toBeInTheDocument();
    });

    it("reloads details when itemId changes", async () => {
        loadDetailsMock
            .mockResolvedValueOnce(itemOne)
            .mockResolvedValueOnce(itemTwo);

        const { rerender } = render(<DetailsPage itemId="1" />);

        expect(await screen.findByText("Test Item")).toBeInTheDocument();

        rerender(<DetailsPage itemId="2" />);

        expect(await screen.findByText("Second Item")).toBeInTheDocument();
        expect(screen.getByText("Another description")).toBeInTheDocument();
        expect(screen.getByText("Item #2")).toBeInTheDocument();
        expect(screen.queryByText("Test Item")).not.toBeInTheDocument();
        expect(loadDetailsMock).toHaveBeenCalledWith("2");
        expect(loadDetailsMock).toHaveBeenCalledTimes(2);
    });

    it("returns null when load resolves without item", async () => {
        loadDetailsMock.mockResolvedValue(null as unknown as Item);

        const { container } = render(<DetailsPage itemId="1" />);

        await waitFor(() => {
            expect(loadDetailsMock).toHaveBeenCalledWith("1");
        });

        expect(container).toBeEmptyDOMElement();
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
        expect(
            screen.queryByText("Failed to load details.")
        ).not.toBeInTheDocument();
    });

    it("shows loading while fetching new itemId", async () => {
        let resolveSecond!: (value: Item) => void;

        loadDetailsMock
            .mockResolvedValueOnce(itemOne)
            .mockImplementationOnce(
                () =>
                    new Promise<Item>((resolve) => {
                        resolveSecond = resolve;
                    })
            );

        const { rerender } = render(<DetailsPage itemId="1" />);

        await screen.findByText("Test Item");

        rerender(<DetailsPage itemId="2" />);

        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        resolveSecond(itemTwo);

        await waitFor(() => {
            expect(screen.getByText("Second Item")).toBeInTheDocument();
        });

        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
});
