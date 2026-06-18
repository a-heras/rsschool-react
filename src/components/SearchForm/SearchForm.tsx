'use client';

import { useActionState, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    submitSearchAction,
    type SearchActionState,
} from '@/actions/search';
import { useAppDispatch } from '@/store/hooks';
import { setSearchTerm } from '@/store/searchSlice';
import '../Search/Search.css';

type SearchFormProps = {
    q: string;
};

const initialState: SearchActionState = null;

export function SearchForm({ q }: SearchFormProps) {
    const t = useTranslations('search');
    const dispatch = useAppDispatch();
    const [term, setTerm] = useState(q);
    const [state, formAction, isPending] = useActionState(
        submitSearchAction,
        initialState
    );

    useEffect(() => {
        setTerm(q);
    }, [q]);

    const handleSubmit = (formData: FormData) => {
        const trimmed = parseQ(formData.get('q')).trim();

        dispatch(setSearchTerm(trimmed));
        localStorage.setItem('searchTerm', trimmed);
        formAction(formData);
    };

    return (
        <form
            action={handleSubmit}
            className="search-container"
            aria-busy={isPending}
        >
            <input
                type="text"
                name="q"
                className="search-input"
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder={t('placeholder')}
            />
            <input type="hidden" name="currentQ" value={q} />
            <button type="submit" className="btn" disabled={isPending}>
                {t('button')}
            </button>
            {state?.error ? (
                <p className="search-form__error" role="alert">
                    {state.error}
                </p>
            ) : null}
        </form>
    );
}

function parseQ(value: FormDataEntryValue | null): string {
    return typeof value === 'string' ? value : '';
}
