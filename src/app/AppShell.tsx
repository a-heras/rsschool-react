'use client';

import { Header } from '@/layout/Header/Header';
import { Main } from '@/layout/Main/Main';

export function AppShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-view">
            <Header />
            <Main>{children}</Main>
        </div>
    );
}
