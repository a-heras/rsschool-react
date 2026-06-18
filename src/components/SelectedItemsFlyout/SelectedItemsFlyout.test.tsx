import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';
import { renderWithIntl } from '@/test-utils/renderWithIntl';
import type { Item } from '@/types/item';

const downloadCsvActionMock = vi.fn();

vi.mock('@/actions/downloadCsv', () => ({
    downloadSelectedItemsCsvAction: (...args: unknown[]) =>
        downloadCsvActionMock(...args),
}));

describe('SelectedItemsFlyout component', () => {
    const onUnselectAll = vi.fn();
    const selectedItems: Item[] = [
        { id: 1, name: 'Item 1', description: 'Desc 1' },
    ];

    beforeEach(() => {
        onUnselectAll.mockClear();
        downloadCsvActionMock.mockClear();
        downloadCsvActionMock.mockResolvedValue({
            csv: 'id,name,description,details_url\n1,Item 1,Desc 1,url',
            filename: '1_items.csv',
        });
    });

    it('renders nothing when count is 0', () => {
        const { container } = renderWithIntl(
            <SelectedItemsFlyout
                count={0}
                selectedItems={[]}
                onUnselectAll={onUnselectAll}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('renders flyout region when count is greater than 0', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={2}
                selectedItems={selectedItems}
                onUnselectAll={onUnselectAll}
            />
        );

        expect(
            screen.getByRole('region', { name: 'Selected items' })
        ).toBeInTheDocument();
    });

    it('shows "1 item selected" for a single item', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={1}
                selectedItems={selectedItems}
                onUnselectAll={onUnselectAll}
            />
        );

        expect(screen.getByText('1 item selected')).toBeInTheDocument();
        expect(screen.queryByText('1 items selected')).not.toBeInTheDocument();
    });

    it('shows "N items selected" for multiple items', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={3}
                selectedItems={selectedItems}
                onUnselectAll={onUnselectAll}
            />
        );

        expect(screen.getByText('3 items selected')).toBeInTheDocument();
    });

    it('calls onUnselectAll when Unselect all is clicked', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={1}
                selectedItems={selectedItems}
                onUnselectAll={onUnselectAll}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Unselect all' }));

        expect(onUnselectAll).toHaveBeenCalledTimes(1);
    });

    it('submits csv download form to server action', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={1}
                selectedItems={selectedItems}
                onUnselectAll={onUnselectAll}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Download' }));

        expect(downloadCsvActionMock).toHaveBeenCalled();
    });
});
