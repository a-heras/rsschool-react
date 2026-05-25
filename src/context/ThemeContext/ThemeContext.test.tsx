import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ThemeProvider } from './ThemeContext';
import { useTheme } from './useTheme';
import { THEME_STORAGE_KEY } from './theme';

function ThemeConsumer() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div>
            <span data-testid="theme">{theme}</span>
            <button type="button" onClick={toggleTheme}>
                Toggle theme
            </button>
        </div>
    );
}

describe('ThemeContext', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.dataset.theme = 'light';
    });

    it('throws when useTheme is used outside ThemeProvider', () => {
        expect(() => render(<ThemeConsumer />)).toThrow(
            'useTheme must be used within ThemeProvider'
        );
    });

    it('sets light theme by default', () => {
        render(<ThemeConsumer />, { wrapper: ThemeProvider });

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(document.documentElement.dataset.theme).toBe('light');
    });

    it('toggles theme and persists to localStorage', () => {
        render(<ThemeConsumer />, { wrapper: ThemeProvider });

        fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');

        fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }));

        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });

    it('restores theme from localStorage', () => {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');

        render(<ThemeConsumer />, { wrapper: ThemeProvider });

        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(document.documentElement.dataset.theme).toBe('dark');
    });
});
