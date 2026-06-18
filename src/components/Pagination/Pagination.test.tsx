import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './Pagination';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

describe('Pagination component', () => {
    it('disables Prev button on first page', () => {
        const onPageChange = vi.fn();

        renderWithIntl(<Pagination page={1} maxPage={5} onPageChange={onPageChange} />);

        const prev = screen.getByText('Prev');
        expect(prev).toBeDisabled();
    });

    it('disables Next button on last page', () => {
        const onPageChange = vi.fn();

        renderWithIntl(<Pagination page={5} maxPage={5} onPageChange={onPageChange} />);

        const next = screen.getByText('Next');
        expect(next).toBeDisabled();
    });

    it('calls onPageChange with page - 1 when Prev clicked', () => {
        const onPageChange = vi.fn();

        renderWithIntl(<Pagination page={3} maxPage={5} onPageChange={onPageChange} />);

        const prev = screen.getByText('Prev');
        fireEvent.click(prev);

        expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with page + 1 when Next clicked', () => {
        const onPageChange = vi.fn();

        renderWithIntl(<Pagination page={3} maxPage={5} onPageChange={onPageChange} />);

        const next = screen.getByText('Next');
        fireEvent.click(next);

        expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('shows correct page number', () => {
        const onPageChange = vi.fn();

        renderWithIntl(
            <Pagination page={7} maxPage={10} onPageChange={onPageChange} />
        );

        expect(screen.getByText('Page 7')).toBeInTheDocument();
    });
});
