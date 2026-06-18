import { getTranslations } from 'next-intl/server';
import '@/components/CardList/CardList.css';
import '@/components/Card/Card.css';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import type { Item } from '@/types/item';
import type { SearchListResult } from '@/lib/search/loadSearchResults';

type SearchResultsListProps = {
    list: SearchListResult;
};

export async function SearchResultsList({ list }: SearchResultsListProps) {
    const t = await getTranslations('search');
    const tCardList = await getTranslations('cardList');

    if (!list.ok) {
        return <ErrorMessage message={t('loadError')} />;
    }

    if (list.items.length === 0) {
        return null;
    }

    return (
        <table className="results-table results-table--server">
            <thead>
                <tr>
                    <th aria-label={tCardList('selectAria')} />
                    <th>{tCardList('nameColumn')}</th>
                    <th>{tCardList('descriptionColumn')}</th>
                </tr>
            </thead>
            <tbody>
                {list.items.map((item) => (
                    <SearchResultRow key={item.id} item={item} />
                ))}
            </tbody>
        </table>
    );
}

function SearchResultRow({ item }: { item: Item }) {
    return (
        <tr className="table-row">
            <td className="table-cell checkbox-cell" />
            <td className="table-cell name-cell">{item.name}</td>
            <td className="table-cell desc-cell">{item.description}</td>
        </tr>
    );
}
