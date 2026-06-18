'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import './Header.css';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';

export function Header() {
    const t = useTranslations('nav');
    const pathname = usePathname();

    return (
        <header className="header">
            <nav className="nav">
                <Link
                    href="/"
                    className={
                        pathname === '/' ? 'nav-link active' : 'nav-link'
                    }
                >
                    {t('home')}
                </Link>
                <Link
                    href="/about"
                    className={
                        pathname === '/about' ? 'nav-link active' : 'nav-link'
                    }
                >
                    {t('about')}
                </Link>
            </nav>
            <div className="header-controls">
                <LanguageSwitcher />
                <ThemeToggle />
            </div>
        </header>
    );
}
