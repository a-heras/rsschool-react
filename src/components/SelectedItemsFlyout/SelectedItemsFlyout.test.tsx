import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

describe('SelectedItemsFlyout component', () => {
    const onUnselectAll = vi.fn();
    const onDownload = vi.fn();

    beforeEach(() => {
        onUnselectAll.mockClear();
        onDownload.mockClear();
    });

    it('renders nothing when count is 0', () => {
        const { container } = renderWithIntl(
            <SelectedItemsFlyout
                count={0}
                onUnselectAll={onUnselectAll}
                onDownload={onDownload}
            />
        );

        expect(container.firstChild).toBeNull();
    });

    it('renders flyout region when count is greater than 0', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={2}
                onUnselectAll={onUnselectAll}
                onDownload={onDownload}
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
                onUnselectAll={onUnselectAll}
                onDownload={onDownload}
            />
        );

        expect(screen.getByText('1 item selected')).toBeInTheDocument();
        expect(screen.queryByText('1 items selected')).not.toBeInTheDocument();
    });

    it('shows "N items selected" for multiple items', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={3}
                onUnselectAll={onUnselectAll}
                onDownload={onDownload}
            />
        );

        expect(screen.getByText('3 items selected')).toBeInTheDocument();
    });

    it('calls onUnselectAll when Unselect all is clicked', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={1}
                onUnselectAll={onUnselectAll}
                onDownload={onDownload}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Unselect all' }));

        expect(onUnselectAll).toHaveBeenCalledTimes(1);
    });

    it('calls onDownload when Download is clicked', () => {
        renderWithIntl(
            <SelectedItemsFlyout
                count={1}
                onUnselectAll={onUnselectAll}
                onDownload={onDownload}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: 'Download' }));

        expect(onDownload).toHaveBeenCalledTimes(1);
    });
});
