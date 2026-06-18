import { getTranslations } from 'next-intl/server';
import './AboutPage.css';

export async function AboutPage() {
    const t = await getTranslations('about');

    return (
        <section className="about">
            <h1 className="about-title">{t('title')}</h1>

            <p className="about-author">{t('author')}</p>

            <p className="about-text">{t('description')}</p>

            <a
                className="text-link"
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
            >
                {t('courseLink')}
            </a>
        </section>
    );
}
