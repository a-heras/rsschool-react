import React, { useSyncExternalStore } from 'react';
import { vi } from 'vitest';

let searchSnapshot = 'page=1';
const listeners = new Set<() => void>();

function emitChange() {
    listeners.forEach((listener) => listener());
}

export function setInitialSearch(search: string) {
    searchSnapshot = search;
    emitChange();
}

export function getSearchSnapshot() {
    return searchSnapshot;
}

export const pushMock = vi.fn((href: string) => {
    const queryIndex = href.indexOf('?');
    searchSnapshot = queryIndex === -1 ? '' : href.slice(queryIndex + 1);
    emitChange();
});

export const replaceMock = vi.fn((href: string) => {
    pushMock(href);
});

vi.mock('@/i18n/navigation', () => ({
    Link: ({
        children,
        href,
        className,
    }: {
        children: React.ReactNode;
        href: string;
        className?: string;
    }) => React.createElement('a', { href, className }, children),
    useRouter: () => ({
        push: pushMock,
        replace: replaceMock,
    }),
    usePathname: () => '/',
    redirect: vi.fn(),
    getPathname: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useSearchParams: () => {
        const search = useSyncExternalStore(
            (onStoreChange) => {
                listeners.add(onStoreChange);
                return () => listeners.delete(onStoreChange);
            },
            () => searchSnapshot,
            () => searchSnapshot
        );
        return new URLSearchParams(search);
    },
}));
