import { type ReactNode } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { SearchPage } from "./SearchPage";
import { loadDataMock, resetApiMocks } from "../test-utils/mockApi";

vi.mock("../api/api", async () => {
    const { loadDataMock: mockedLoadData } = await import("../test-utils/mockApi");
    return { loadData: mockedLoadData };
});

function renderWithRouter(ui: ReactNode, url = "/?page=1") {
    return render(
        <MemoryRouter initialEntries={[url]}>
            {ui}
        </MemoryRouter>
    );
}

const emptyLoadResult = { items: [], total: 0 };

describe("SearchPage component", () => {
    beforeEach(() => {
        localStorage.clear();
        resetApiMocks();
    });

    it("loads initial data on mount (success)", async () => {
        localStorage.setItem("searchTerm", "initial");
        loadDataMock.mockResolvedValue({
            items: [{ name: "A", description: "B" }],
            total: 1,
        });

        renderWithRouter(<SearchPage />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("A")).toBeInTheDocument();
            expect(screen.getByText("B")).toBeInTheDocument();
        });

        expect(loadDataMock).toHaveBeenCalledWith("initial", 1);
    });

    it("shows error message when initial load fails", async () => {
        localStorage.setItem("searchTerm", "initial");
        loadDataMock.mockRejectedValue(new Error("fail"));

        renderWithRouter(<SearchPage />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();

        await waitFor(() => {
            expect(
                screen.getByText("Failed to load data. Please try again.")
            ).toBeInTheDocument();
        });
    });

    it("calls loadData on mount with empty searchTerm when localStorage is empty", () => {
        loadDataMock.mockResolvedValue(emptyLoadResult);

        renderWithRouter(<SearchPage />);

        expect(loadDataMock).toHaveBeenCalledWith("", 1);
    });

    it("calls loadData with trimmed search term when searching", async () => {
        loadDataMock.mockResolvedValue(emptyLoadResult);

        renderWithRouter(<SearchPage />);

        const input = screen.getByPlaceholderText("Search...");
        const button = screen.getByText("Search");

        fireEvent.change(input, { target: { value: "   hello   " } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith("hello", 1);
        });
    });

    it("does not search if term is same as lastSearchTerm", async () => {
        localStorage.setItem("searchTerm", "same");
        loadDataMock.mockResolvedValue(emptyLoadResult);

        renderWithRouter(<SearchPage />);

        await waitFor(() => {
            expect(loadDataMock).toHaveBeenCalledWith("same", 1);
        });

        const input = screen.getByPlaceholderText("Search...");
        const button = screen.getByText("Search");

        fireEvent.change(input, { target: { value: "same" } });
        fireEvent.click(button);

        expect(loadDataMock).toHaveBeenCalledTimes(1);
    });

    it("shows loading when searching", async () => {
        loadDataMock.mockResolvedValue(emptyLoadResult);

        renderWithRouter(<SearchPage />);

        const input = screen.getByPlaceholderText("Search...");
        const button = screen.getByText("Search");

        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.click(button);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows error message when search fails", async () => {
        loadDataMock.mockRejectedValue(new Error("fail"));

        renderWithRouter(<SearchPage />);

        const input = screen.getByPlaceholderText("Search...");
        const button = screen.getByText("Search");

        fireEvent.change(input, { target: { value: "abc" } });
        fireEvent.click(button);

        await waitFor(() => {
            expect(
                screen.getByText("Failed to load data. Please try again.")
            ).toBeInTheDocument();
        });
    });
});