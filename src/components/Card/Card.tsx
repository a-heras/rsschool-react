'use client';

import type { ComponentProps } from 'react';
import { useTranslations } from 'next-intl';
import { type Item } from '@/types/item';
import { selectDetailsAction } from '@/actions/search';
import './Card.css';

type SearchContext = {
    q: string;
    page: number;
    detailsId: string | null;
};

type CardProps = {
    item: Item;
    isSelected: boolean;
    onToggleSelect: (item: Item) => void;
    onOpenDetails?: (id: string) => void;
    selectDetailsAction?: typeof selectDetailsAction;
    searchContext?: SearchContext;
};

export function Card({
    item,
    isSelected,
    onToggleSelect,
    onOpenDetails,
    selectDetailsAction: detailsAction,
    searchContext,
}: CardProps) {
    const t = useTranslations('cardList');
    const useServerAction = detailsAction && searchContext;

    const row = (
        <tr
            className="table-row"
            onClick={
                useServerAction
                    ? (event) => {
                          if (
                              (event.target as HTMLElement).closest(
                                  'input[type="checkbox"]'
                              )
                          ) {
                              return;
                          }

                          (
                              event.currentTarget
                                  .closest('form') as HTMLFormElement | null
                          )?.requestSubmit();
                      }
                    : () => onOpenDetails?.(String(item.id))
            }
        >
            <td className="table-cell checkbox-cell">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(item)}
                    onClick={(event) => event.stopPropagation()}
                    aria-label={t('selectItem', { name: item.name })}
                />
            </td>
            <td className="table-cell name-cell">{item.name}</td>
            <td className="table-cell desc-cell">{item.description}</td>
        </tr>
    );

    if (!useServerAction) {
        return row;
    }

    return (
        <DetailsSelectForm
            action={detailsAction}
            searchContext={searchContext}
            detailsId={String(item.id)}
        >
            {row}
        </DetailsSelectForm>
    );
}

function DetailsSelectForm({
    action,
    searchContext,
    detailsId,
    children,
}: {
    action: NonNullable<CardProps['selectDetailsAction']>;
    searchContext: SearchContext;
    detailsId: string;
    children: ComponentProps<'form'>['children'];
}) {
    return (
        <form action={action} style={{ display: 'contents' }}>
            <input type="hidden" name="detailsId" value={detailsId} />
            <input
                type="hidden"
                name="currentDetailsId"
                value={searchContext.detailsId ?? ''}
            />
            <input type="hidden" name="q" value={searchContext.q} />
            <input type="hidden" name="page" value={String(searchContext.page)} />
            {children}
        </form>
    );
}
