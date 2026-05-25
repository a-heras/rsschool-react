import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Card } from "./Card";
import type { Item } from "../../types/item";

describe("Card component", () => {
    const item: Item = {
        id: 1,
        name: "Test Name",
        description: "Test Description",
    };

    const defaultProps = {
        item,
        isSelected: false,
        onToggleSelect: vi.fn(),
        onOpenDetails: vi.fn(),
    };

    it("renders table row", () => {
        render(
            <table>
                <tbody>
                    <Card {...defaultProps} />
                </tbody>
            </table>
        );
        expect(screen.getByRole("row")).toBeInTheDocument();
    });

    it("renders item name and description", () => {
        render(
            <table>
                <tbody>
                    <Card {...defaultProps} />
                </tbody>
            </table>
        );
        expect(screen.getByText("Test Name")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
    });

    it("calls onOpenDetails when row is clicked", () => {
        const onOpenDetails = vi.fn();

        render(
            <table>
                <tbody>
                    <Card {...defaultProps} onOpenDetails={onOpenDetails} />
                </tbody>
            </table>
        );

        fireEvent.click(screen.getByText("Test Name"));

        expect(onOpenDetails).toHaveBeenCalledWith("1");
    });

    it("calls onToggleSelect when checkbox is clicked", () => {
        const onToggleSelect = vi.fn();

        render(
            <table>
                <tbody>
                    <Card {...defaultProps} onToggleSelect={onToggleSelect} />
                </tbody>
            </table>
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(onToggleSelect).toHaveBeenCalledWith(item);
    });

    it("does not call onOpenDetails when checkbox is clicked", () => {
        const onOpenDetails = vi.fn();
        const onToggleSelect = vi.fn();

        render(
            <table>
                <tbody>
                    <Card
                        {...defaultProps}
                        onOpenDetails={onOpenDetails}
                        onToggleSelect={onToggleSelect}
                    />
                </tbody>
            </table>
        );

        fireEvent.click(screen.getByRole("checkbox"));

        expect(onToggleSelect).toHaveBeenCalled();
        expect(onOpenDetails).not.toHaveBeenCalled();
    });
});
