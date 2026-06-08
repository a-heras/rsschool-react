import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { createTestStore } from './test-utils/testStore';
import { loadDataMock, resetApiMocks } from './test-utils/mockApi';
import { ThemeProvider } from './context/ThemeContext/ThemeContext';

vi.mock('./api/api', async () => {
    const { loadDataMock: mockedLoadData } =
        await import('./test-utils/mockApi');
    return { loadData: mockedLoadData };
});

describe('App component', () => {
    beforeEach(() => {
        localStorage.clear();
        resetApiMocks();
        loadDataMock.mockResolvedValue({ items: [], total: 0 });
    });

    it('renders search UI for user interaction', async () => {
        render(
            <Provider store={createTestStore()}>
                <ThemeProvider>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </ThemeProvider>
            </Provider>
        );

        expect(
            await screen.findByPlaceholderText('Search...')
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Search' })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Switch to dark theme' })
        ).toBeInTheDocument();
    });

    it('switches document theme when toggle is clicked', async () => {
        render(
            <Provider store={createTestStore()}>
                <ThemeProvider>
                    <MemoryRouter>
                        <App />
                    </MemoryRouter>
                </ThemeProvider>
            </Provider>
        );

        await screen.findByPlaceholderText('Search...');

        fireEvent.click(
            screen.getByRole('button', { name: 'Switch to dark theme' })
        );

        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});
