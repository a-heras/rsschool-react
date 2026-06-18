'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
    downloadSelectedItemsCsvAction,
    type CsvDownloadState,
} from '@/actions/downloadCsv';
import { triggerCsvDownload } from '@/utils/triggerCsvDownload';
import type { Item } from '@/types/item';

interface CsvDownloadButtonProps {
    items: Item[];
}

const initialState: CsvDownloadState = null;

export function CsvDownloadButton({ items }: CsvDownloadButtonProps) {
    const t = useTranslations('flyout');
    const locale = useLocale();
    const [state, formAction, isPending] = useActionState(
        downloadSelectedItemsCsvAction,
        initialState
    );
    const lastDownloadRef = useRef<string | null>(null);

    useEffect(() => {
        if (!state?.csv) {
            return;
        }

        const downloadKey = `${state.filename}:${state.csv}`;
        if (lastDownloadRef.current === downloadKey) {
            return;
        }

        lastDownloadRef.current = downloadKey;
        triggerCsvDownload(state.csv, state.filename);
    }, [state]);

    if (items.length === 0) {
        return null;
    }

    return (
        <form action={formAction}>
            <input type="hidden" name="items" value={JSON.stringify(items)} />
            <input type="hidden" name="locale" value={locale} />
            <button
                type="submit"
                className="btn btn--on-dark"
                disabled={isPending}
            >
                {t('download')}
            </button>
        </form>
    );
}
