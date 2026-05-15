import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SearchPage } from "./SearchPage";
import { loadDataMock, resetApiMocks } from "../test-utils/mockApi";

vi.mock("../api/api", async () => {
    const { loadDataMock: mockedLoadData } = await import("../test-utils/mockApi");
    return { loadData: mockedLoadData };
});

describe("SearchPage component", () => {
beforeEach(() => {
    localStorage.clear();
    resetApiMocks();
});

it("loads initial data on mount (success)", async () => {
    localStorage.setItem("searchTerm", "initial");
    loadDataMock.mockResolvedValue([{ name: "A", description: "B" }]);

    render(<SearchPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    });
});

it("shows error message when initial load fails", async () => {
    localStorage.setItem("searchTerm", "initial");
    loadDataMock.mockRejectedValue(new Error("fail"));

    render(<SearchPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
    expect(
        screen.getByText("Failed to load data. Please try again.")
    ).toBeInTheDocument();
    });
});

it("does not call loadData on mount when localStorage is empty", () => {
    loadDataMock.mockResolvedValue([]);

    render(<SearchPage />);

    expect(loadDataMock).not.toHaveBeenCalled();
});

it("calls loadData with trimmed search term when searching", async () => {
    loadDataMock.mockResolvedValue([]);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "   hello   " } });
    fireEvent.click(button);

    await waitFor(() => {
    expect(loadDataMock).toHaveBeenCalledWith("hello");
    });
});

it("does not search if term is same as lastSearchTerm", async () => {
    loadDataMock.mockResolvedValue([]);

    localStorage.setItem("searchTerm", "same");

    render(<SearchPage />);

    await waitFor(() => {
    expect(loadDataMock).toHaveBeenCalledWith("same");
    });

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "same" } });
    fireEvent.click(button);

    expect(loadDataMock).toHaveBeenCalledTimes(1);
});

it("shows loading when searching", async () => {
    loadDataMock.mockResolvedValue([]);

    render(<SearchPage />);

    const input = screen.getByPlaceholderText("Search...");
    const button = screen.getByText("Search");

    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.click(button);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

it("shows error message when search fails", async () => {
    loadDataMock.mockRejectedValue(new Error("fail"));

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
