import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Search } from "./Search";

describe("Search component", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("renders input and button", () => {
        render(<Search onSearch={() => {}} />);

        expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
        expect(screen.getByText("Search")).toBeInTheDocument();
    });

    it("loads saved search term from parent on mount", () => {
        render(<Search onSearch={() => {}} savedTerm="SavedTerm" />);

        expect(screen.getByDisplayValue("SavedTerm")).toBeInTheDocument();
    });

    it("updates input value when user types", () => {
        render(<Search onSearch={() => {}} />);

        const input = screen.getByPlaceholderText("Search...");

        fireEvent.change(input, { target: { value: "Hello" } });

        expect(input).toHaveValue("Hello");
    });

    it("calls onSearch with trimmed value when button is clicked", () => {
        const onSearchMock = vi.fn();

        render(<Search onSearch={onSearchMock} />);

        const input = screen.getByPlaceholderText("Search...");
        const button = screen.getByText("Search");

        fireEvent.change(input, { target: { value: "   test value   " } });
        fireEvent.click(button);

        expect(onSearchMock).toHaveBeenCalledWith("test value");
    });

    it("does NOT write to localStorage on typing (only reads on mount)", () => {
        render(<Search onSearch={() => {}} />);

        const input = screen.getByPlaceholderText("Search...");

        fireEvent.change(input, { target: { value: "abc" } });

        expect(localStorage.getItem("searchTerm")).toBeNull();
    });

    it("does NOT crash when localStorage is empty", () => {
        render(<Search onSearch={() => {}} />);

        const input = screen.getByPlaceholderText("Search...");
        expect(input).toHaveValue("");
    });
});