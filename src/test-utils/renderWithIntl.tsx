import { NextIntlClientProvider } from 'next-intl';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import enMessages from '../../messages/en.json';

type RenderWithIntlOptions = RenderOptions & {
    locale?: string;
};

export function renderWithIntl(
    ui: ReactElement,
    { locale = 'en', ...options }: RenderWithIntlOptions = {}
) {
    return render(
        <NextIntlClientProvider locale={locale} messages={enMessages}>
            {ui}
        </NextIntlClientProvider>,
        options
    );
}
