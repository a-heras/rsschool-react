import type { Metadata } from 'next';
import { Providers } from './providers';
import { AppShell } from '@/app/AppShell';
import '@/index.css';
import '@/App.css';

export const metadata: Metadata = {
    title: 'Search App',
    description: 'RS School React course project',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <Providers>
                    <AppShell>{children}</AppShell>
                </Providers>
            </body>
        </html>
    );
}
