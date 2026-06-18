import { Suspense } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { SearchPage } from '@/views/SearchPage/SearchPage';
import { Loading } from '@/components/Loading/Loading';

type PageProps = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    return (
        <Suspense
            fallback={
                <div className="results-section panel">
                    <Loading />
                </div>
            }
        >
            <SearchPage />
        </Suspense>
    );
}
