import { Suspense } from 'react';
import { SearchPage } from '@/views/SearchPage/SearchPage';
import { Loading } from '@/components/Loading/Loading';

export default function HomePage() {
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
