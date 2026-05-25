import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CardList } from './CardList';
import type { Item } from '../../types/item';

describe('CardList component', () => {
    const onToggleSelect = vi.fn();
    const onOpenDetails = vi.fn();

    const items: Item[] = [
        { id: 1, name: 'Item 1', description: 'Description 1' },
        { id: 2, name: 'Item 2', description: 'Description 2' },
    ];

    const defaultProps = {
        items,
        selectedItems: [] as Item[],
        onToggleSelect,
        onOpenDetails,
    };

    beforeEach(() => {
        onToggleSelect.mockClear();
        onOpenDetails.mockClear();
    });

    it('renders table with headers', () => {
        render(<CardList {...defaultProps} />);

        expect(screen.getByText('Item Name')).toBeInTheDocument();
        expect(screen.getByText('Item Description')).toBeInTheDocument();
    });

    it('renders correct number of rows', () => {
        render(<CardList {...defaultProps} />);

        const rows = screen.getAllByRole('row');
        expect(rows.length).toBe(3);
    });

    it('marks selected items with checked checkbox', () => {
        render(<CardList {...defaultProps} selectedItems={[items[0]]} />);

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes[0]).toBeChecked();
        expect(checkboxes[1]).not.toBeChecked();
    });

    it('calls onOpenDetails when row text is clicked', () => {
        render(<CardList {...defaultProps} />);

        fireEvent.click(screen.getByText('Item 1'));

        expect(onOpenDetails).toHaveBeenCalledWith('1');
    });

    it('calls onToggleSelect when checkbox is clicked', () => {
        render(<CardList {...defaultProps} />);

        fireEvent.click(screen.getAllByRole('checkbox')[0]);

        expect(onToggleSelect).toHaveBeenCalledWith(items[0]);
    });
});
