import '@/test-utils/mockNextNavigation';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { NextIntlClientProvider } from 'next-intl';
import { AppShell } from '@/app/AppShell';
import { SearchPage } from '@/views/SearchPage/SearchPage';
import { ThemeProvider } from '@/context/ThemeContext/ThemeContext';
import { createTestStore } from '@/test-utils/testStore';
import { loadDataMock, resetApiMocks } from '@/test-utils/mockApi';
import { setInitialSearch } from '@/test-utils/mockNextNavigation';
import enMessages from '../../messages/en.json';

vi.mock('@/api/api', async () => {
    const { loadDataMock: mockedLoadData } =
        await import('@/test-utils/mockApi');
    return { loadData: mockedLoadData };
});

describe('App shell', () => {
    beforeEach(() => {
        localStorage.clear();
        resetApiMocks();
        loadDataMock.mockResolvedValue({ items: [], total: 0 });
        setInitialSearch('page=1');
    });

    function renderApp() {
        const store = createTestStore();
        return render(
            <Provider store={store}>
                <NextIntlClientProvider locale="en" messages={enMessages}>
                    <ThemeProvider>
                        <AppShell>
                            <SearchPage />
                        </AppShell>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </Provider>
        );
    }

    it('renders search UI for user interaction', async () => {
        renderApp();

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
        renderApp();

        await screen.findByPlaceholderText('Search...');

        fireEvent.click(
            screen.getByRole('button', { name: 'Switch to dark theme' })
        );

        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});
