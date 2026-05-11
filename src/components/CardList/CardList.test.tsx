import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CardList } from "./CardList";
import type { Item } from "../../types/item";

describe("CardList component", () => {
    const items: Item[] = [
        { name: "Item 1", description: "Description 1" },
        { name: "Item 2", description: "Description 2" }
    ];

    it("renders table with headers", () => {
        render(<CardList items={items} />);

        expect(screen.getByText("Item Name")).toBeInTheDocument();
        expect(screen.getByText("Item Description")).toBeInTheDocument();
    });

    it("renders correct number of rows", () => {
        render(<CardList items={items} />);

        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(3);
    });

    it("renders item names and descriptions", () => {
        render(<CardList items={items} />);

        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();
    });

    it("renders empty table body when items is empty", () => {
        render(<CardList items={[]} />);

        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(1);
    });
});