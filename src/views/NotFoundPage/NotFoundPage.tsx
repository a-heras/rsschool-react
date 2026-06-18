import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import './NotFoundPage.css';

export async function NotFoundPage() {
    const t = await getTranslations('notFound');

    return (
        <section className="notfound">
            <h1 className="notfound-title">{t('title')}</h1>

            <p className="notfound-text">{t('description')}</p>

            <Link className="text-link" href="/">
                {t('goHome')}
            </Link>
        </section>
    );
}
