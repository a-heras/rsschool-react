import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CardList } from "./CardList";
import type { Item } from "../../types/item";

describe("CardList component", () => {
    const onItemClick = vi.fn();

    beforeEach(() => {
        onItemClick.mockClear();
    });

    const items: Item[] = [
        { id: 1, name: "Item 1", description: "Description 1" },
        { id: 2, name: "Item 2", description: "Description 2" },
    ];

    it("renders table with headers", () => {
        render(<CardList items={items} onItemClick={onItemClick} />);

        expect(screen.getByText("Item Name")).toBeInTheDocument();
        expect(screen.getByText("Item Description")).toBeInTheDocument();
    });

    it("renders correct number of rows", () => {
        render(<CardList items={items} onItemClick={onItemClick} />);

        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(3);
    });

    it("renders item names and descriptions", () => {
        render(<CardList items={items} onItemClick={onItemClick} />);

        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Description 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Description 2")).toBeInTheDocument();
    });

    it("renders empty table body when items is empty", () => {
        render(<CardList items={[]} onItemClick={onItemClick} />);

        const rows = screen.getAllByRole("row");
        expect(rows.length).toBe(1);
    });

    it("calls onItemClick with item id when row is clicked", () => {
        render(<CardList items={items} onItemClick={onItemClick} />);

        fireEvent.click(screen.getByText("Item 1"));

        expect(onItemClick).toHaveBeenCalledTimes(1);
        expect(onItemClick).toHaveBeenCalledWith("1");
    });

    it("does not call onItemClick when item id is null", () => {
        const itemsWithoutId = [
            { id: null, name: "No id", description: "Desc" } as unknown as Item,
        ];

        render(<CardList items={itemsWithoutId} onItemClick={onItemClick} />);

        fireEvent.click(screen.getByText("No id"));

        expect(onItemClick).not.toHaveBeenCalled();
    });
});