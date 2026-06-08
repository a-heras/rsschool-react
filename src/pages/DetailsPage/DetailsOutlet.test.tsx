import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DetailsOutlet } from './DetailsOutlet';

vi.mock('./DetailsPage', () => ({
    DetailsPage: ({ itemId }: { itemId: string }) => (
        <div>Details for {itemId}</div>
    ),
}));

function renderOutlet(url: string) {
    return render(
        <MemoryRouter initialEntries={[url]}>
            <Routes>
                <Route path="/" element={<DetailsOutlet />} />
            </Routes>
        </MemoryRouter>
    );
}

describe('DetailsOutlet', () => {
    it('returns null when no details param', () => {
        renderOutlet('/');

        expect(screen.queryByText(/Details for/i)).toBeNull();
    });

    it('renders DetailsPage when details param exists', () => {
        renderOutlet('/?details=5');

        expect(screen.getByText('Details for 5')).toBeInTheDocument();
    });

    it("does not render when details param is 'undefined'", () => {
        renderOutlet('/?details=undefined');

        expect(screen.queryByText(/Details for/i)).toBeNull();
    });
});
