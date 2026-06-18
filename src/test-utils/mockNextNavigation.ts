import { useSyncExternalStore } from 'react';
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

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        replace: pushMock,
    }),
    usePathname: () => '/',
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
