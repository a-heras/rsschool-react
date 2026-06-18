'use client';

import { useState, useEffect, useMemo, type ReactNode } from 'react';
import type { Theme } from './theme';
import { THEME_STORAGE_KEY } from './theme';
import { ThemeContext } from './theme-context';

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    const value = useMemo(
        () => ({
            theme,
            setTheme,
            toggleTheme: () =>
                setTheme((t) => (t === 'light' ? 'dark' : 'light')),
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
    );
}
