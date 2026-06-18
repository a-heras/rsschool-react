import '@/test-utils/mockNextNavigation';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import enMessages from '../../../messages/en.json';
import { NotFoundPage } from './NotFoundPage';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

vi.mock('next-intl/server', () => ({
    getTranslations: async (namespace: string) => {
        const messages = enMessages[namespace as keyof typeof enMessages] as
            | Record<string, string>
            | undefined;

        return (key: string) => messages?.[key] ?? key;
    },
}));

describe('NotFoundPage', () => {
    it('renders 404 message', async () => {
        renderWithIntl(await NotFoundPage());

        expect(screen.getByText(/404/i)).toBeInTheDocument();
        expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
        expect(screen.getByText(/Go Home/i)).toBeInTheDocument();
    });
});
