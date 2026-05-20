import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { loadDataMock, resetApiMocks } from "./test-utils/mockApi";

vi.mock("./api/api", async () => {
    const { loadDataMock: mockedLoadData } = await import("./test-utils/mockApi");
    return { loadData: mockedLoadData };
});

describe("App component", () => {
    beforeEach(() => {
        localStorage.clear();
        resetApiMocks();
        loadDataMock.mockResolvedValue({ items: [], total: 0 });
    });

    it("renders search UI for user interaction", async () => {
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );

        expect(await screen.findByPlaceholderText("Search...")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
    });
});
