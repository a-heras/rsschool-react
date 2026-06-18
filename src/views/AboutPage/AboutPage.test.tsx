import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import enMessages from '../../../messages/en.json';
import { AboutPage } from './AboutPage';
import { renderWithIntl } from '@/test-utils/renderWithIntl';

vi.mock('next-intl/server', () => ({
    getTranslations: async (namespace: string) => {
        const messages = enMessages[namespace as keyof typeof enMessages] as
            | Record<string, string>
            | undefined;

        return (key: string) => messages?.[key] ?? key;
    },
}));

describe('AboutPage', () => {
    it('renders author info and RS School link', async () => {
        renderWithIntl(await AboutPage());

        expect(screen.getByText('About This App')).toBeInTheDocument();

        expect(screen.getByText(/Author: Artem/i)).toBeInTheDocument();

        expect(
            screen.getByText(
                /This application was created as part of the RS School React course/i
            )
        ).toBeInTheDocument();

        const link = screen.getByText('RS School React Course');
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute(
            'href',
            'https://rs.school/courses/reactjs'
        );
        expect(link).toHaveAttribute('target', '_blank');
    });
});
