'use client';

import { useTranslations } from 'next-intl';
import { type Item } from '@/types/item';
import { selectDetailsAction } from '@/actions/search';
import { Card } from '../Card/Card';
import './CardList.css';

type SearchContext = {
    q: string;
    page: number;
    detailsId: string | null;
};

interface CardListProps {
    items: Item[];
    selectedItems: Item[];
    onToggleSelect: (item: Item) => void;
    onOpenDetails?: (id: string) => void;
    selectDetailsAction?: typeof selectDetailsAction;
    searchContext?: SearchContext;
}

export function CardList({
    items,
    selectedItems,
    onToggleSelect,
    onOpenDetails,
    selectDetailsAction: detailsAction,
    searchContext,
}: CardListProps) {
    const t = useTranslations('cardList');

    return (
        <table className="results-table">
            <thead>
                <tr>
                    <th aria-label={t('selectAria')} />
                    <th>{t('nameColumn')}</th>
                    <th>{t('descriptionColumn')}</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => {
                    const isSelected = selectedItems.some(
                        (selected) => selected.id === item.id
                    );

                    return (
                        <Card
                            key={item.id}
                            item={item}
                            isSelected={isSelected}
                            onToggleSelect={onToggleSelect}
                            onOpenDetails={onOpenDetails}
                            selectDetailsAction={detailsAction}
                            searchContext={searchContext}
                        />
                    );
                })}
            </tbody>
        </table>
    );
}
