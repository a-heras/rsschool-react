'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';
import './LanguageSwitcher.css';

export function LanguageSwitcher() {
    const t = useTranslations('language');
    const locale = useLocale() as Locale;
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div
            className="language-switcher"
            role="group"
            aria-label={t('label')}
        >
            {routing.locales.map((loc) => (
                <button
                    key={loc}
                    type="button"
                    className={
                        loc === locale ? 'lang-btn active' : 'lang-btn'
                    }
                    aria-pressed={loc === locale}
                    onClick={() => router.replace(pathname, { locale: loc })}
                >
                    {loc.toUpperCase()}
                </button>
            ))}
        </div>
    );
}
