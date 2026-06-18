import { setRequestLocale } from 'next-intl/server';
import { AboutPage } from '@/views/AboutPage/AboutPage';

type PageProps = {
    params: Promise<{ locale: string }>;
};

export default async function About({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return <AboutPage />;
}
