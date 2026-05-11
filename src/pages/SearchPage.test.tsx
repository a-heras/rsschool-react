import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchPage } from "./SearchPage";
import { loadData } from "../api/api";

vi.mock("../api/api", () => ({
    loadData: vi.fn(),
}));

describe("SearchPage component", () => {
beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

it("loads initial data on mount (success)", async () => {
    localStorage.setItem("searchTerm", "initial");
    vi.mocked(loadData).mockResolvedValue([{ name: "A", description: "B" }]);

    render(<SearchPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    });
});

it("shows error message when initial load fails", async () => {
    vi.mocked(loadData).mockRejectedValue(new Error("fail"));

    render(<SearchPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
    expect(
        screen.getByText("Failed to load data. Please try again.")
    ).toBeInTheDocument();
    });
});

it("calls loadData with trimmed search term when searching", async () => {
    vi.mocked(loadData).mockResolvedValue([]);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "   hello   " } });
    fireEvent.click(button);

    await waitFor(() => {
    expect(loadData).toHaveBeenCalledWith("hello");
    });
});

it("does not search if term is same as lastSearchTerm", async () => {
    vi.mocked(loadData).mockResolvedValue([]);

    localStorage.setItem("searchTerm", "same");

    render(<SearchPage />);

    await waitFor(() => {
    expect(loadData).toHaveBeenCalledWith("same");
    });

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "same" } });
    fireEvent.click(button);

    expect(loadData).toHaveBeenCalledTimes(1);
});

it("shows loading when searching", async () => {
    vi.mocked(loadData).mockResolvedValue([]);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(button);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("shows error message when search fails", async () => {
    vi.mocked(loadData).mockRejectedValue(new Error("fail"));

    render(<SearchPage />);

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
