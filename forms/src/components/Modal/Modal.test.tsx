import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
    children: <p>Form content</p>,
};

describe('Modal', () => {
    it('does not render when isOpen is false', () => {
        render(<Modal {...defaultProps} isOpen={false} />);

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders dialog in document.body via portal', () => {
        render(<Modal {...defaultProps} />);

        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Form content')).toBeInTheDocument();
        expect(document.body).toContainElement(dialog);
    });

    it('calls onClose when Escape is pressed', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(<Modal {...defaultProps} onClose={onClose} />);

        await user.keyboard('{Escape}');

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(<Modal {...defaultProps} onClose={onClose} />);

        const overlay = document.querySelector('.modal-overlay');
        expect(overlay).not.toBeNull();

        await user.click(overlay as Element);

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal content is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();

        render(<Modal {...defaultProps} onClose={onClose} />);

        await user.click(screen.getByText('Form content'));

        expect(onClose).not.toHaveBeenCalled();
    });
});