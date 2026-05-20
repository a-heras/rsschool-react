import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";
import type { Item } from "../../types/item";

describe("Card component", () => {
    const item: Item = {
        id: 1,
        name: "Test Name",
        description: "Test Description",
    };

    it("renders table row", () => {
        render(<table><tbody><Card item={item} /></tbody></table>);
        const row = screen.getByRole("row");
        expect(row).toBeInTheDocument();
    });

    it("renders item name", () => {
        render(<table><tbody><Card item={item} /></tbody></table>);
        expect(screen.getByText("Test Name")).toBeInTheDocument();
    });

    it("renders item description", () => {
        render(<table><tbody><Card item={item} /></tbody></table>);
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("handles missing description gracefully", () => {
        const itemWithoutDesc = { name: "Only Name" } as Item;

        render(<table><tbody><Card item={itemWithoutDesc} /></tbody></table>);

        expect(screen.getByText("Only Name")).toBeInTheDocument();
    });
});