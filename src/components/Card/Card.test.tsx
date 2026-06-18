import type { ComponentProps } from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';
import type { Item } from '../../types/item';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

function renderCard(props: ComponentProps<typeof Card>) {
    return renderWithIntl(
        <table>
            <tbody>
                <Card {...props} />
            </tbody>
        </table>
    );
}

describe('Card component', () => {
    const item: Item = {
        id: 1,
        name: 'Test Name',
        description: 'Test Description',
    };

    const defaultProps = {
        item,
        isSelected: false,
        onToggleSelect: vi.fn(),
        onOpenDetails: vi.fn(),
    };

    it('renders table row', () => {
        renderCard(defaultProps);
        expect(screen.getByRole('row')).toBeInTheDocument();
    });

    it('renders item name and description', () => {
        renderCard(defaultProps);
        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('calls onOpenDetails when row is clicked', () => {
        const onOpenDetails = vi.fn();

        renderCard({ ...defaultProps, onOpenDetails: onOpenDetails });

        fireEvent.click(screen.getByText('Test Name'));

        expect(onOpenDetails).toHaveBeenCalledWith('1');
    });

    it('calls onToggleSelect when checkbox is clicked', () => {
        const onToggleSelect = vi.fn();

        renderCard({ ...defaultProps, onToggleSelect: onToggleSelect });

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onToggleSelect).toHaveBeenCalledWith(item);
    });

    it('does not call onOpenDetails when checkbox is clicked', () => {
        const onOpenDetails = vi.fn();
        const onToggleSelect = vi.fn();

        renderCard({
            ...defaultProps,
            onOpenDetails: onOpenDetails,
            onToggleSelect: onToggleSelect,
        });

        fireEvent.click(screen.getByRole('checkbox'));

        expect(onToggleSelect).toHaveBeenCalled();
        expect(onOpenDetails).not.toHaveBeenCalled();
    });
});
