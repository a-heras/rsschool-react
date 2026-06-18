import { getTranslations } from 'next-intl/server';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import type { Item } from '@/types/item';
import type { SearchDetailsResult } from '@/lib/search/loadSearchResults';
import '../DetailsPage/DetailsPage.css';

type SearchDetailsPanelProps = {
    details: SearchDetailsResult;
};

export async function SearchDetailsPanel({
    details,
}: SearchDetailsPanelProps) {
    const t = await getTranslations('details');

    if (!details.ok) {
        return (
            <section className="details-panel">
                <ErrorMessage message={t('loadError')} />
            </section>
        );
    }

    return (
        <section className="details-panel">
            <article className="details-container">
                <p className="details-label">
                    {t('itemLabel', { id: details.item.id })}
                </p>
                <h2 className="details-title">{details.item.name}</h2>
                <p className="details-text">{details.item.description}</p>
            </article>
        </section>
    );
}

export type { Item };
