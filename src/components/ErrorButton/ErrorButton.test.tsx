import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorButton } from './ErrorButton';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

describe('ErrorButton component', () => {
    it('renders button', () => {
        renderWithIntl(<ErrorButton />);
        expect(screen.getByText('Throw Error')).toBeInTheDocument();
    });

    it('throws error when clicked', () => {
        const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

        renderWithIntl(<ErrorButton />);

        const button = screen.getByText('Throw Error');

        expect(() => {
            fireEvent.click(button);
        }).toThrow('Test error triggered by ErrorButton');

        spy.mockRestore();
    });
});
