import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import App from "./App";

vi.mock("./api/api", () => ({
  loadData: vi.fn().mockResolvedValue([]),
}));

describe("App component", () => {
  it("renders search UI for user interaction", async () => {
    render(<App />);

    expect(await screen.findByPlaceholderText("Search...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument();
  });
});