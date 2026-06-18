'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Header.css';
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle';

export function Header() {
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
                    Home
                </Link>
                <Link
                    href="/about"
                    className={
                        pathname === '/about' ? 'nav-link active' : 'nav-link'
                    }
                >
                    About
                </Link>
            </nav>
            <ThemeToggle />
        </header>
    );
}
