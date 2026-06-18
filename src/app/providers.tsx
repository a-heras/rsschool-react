'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/context/ThemeContext/ThemeContext';
import { ErrorBoundary } from '@/error-boundary/ErrorBoundary';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <ErrorBoundary>{children}</ErrorBoundary>
            </ThemeProvider>
        </Provider>
    );
}
