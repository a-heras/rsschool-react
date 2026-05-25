import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
    it('renders 404 message', () => {
        render(
            <MemoryRouter>
                <NotFoundPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/404/i)).toBeInTheDocument();
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
        expect(screen.getByText(/Go Home/i)).toBeInTheDocument();
    });
});
