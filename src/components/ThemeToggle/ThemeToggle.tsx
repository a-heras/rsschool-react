'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from '@/context/ThemeContext/useTheme';

export function ThemeToggle() {
    const t = useTranslations('theme');
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={
                theme === 'light' ? t('switchToDark') : t('switchToLight')
            }
        >
            {theme === 'light' ? t('dark') : t('light')}
        </button>
    );
}
