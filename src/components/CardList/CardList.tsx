'use client';

import { useTranslations } from 'next-intl';
import { type Item } from '@/types/item';
import { Card } from '../Card/Card';
import './CardList.css';

interface CardListProps {
    items: Item[];
    selectedItems: Item[];
    onToggleSelect: (item: Item) => void;
    onOpenDetails: (id: string) => void;
}

export function CardList({
    items,
    selectedItems,
    onToggleSelect,
    onOpenDetails,
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
                        />
                    );
                })}
            </tbody>
        </table>
    );
}
