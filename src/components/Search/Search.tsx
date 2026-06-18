'use client';

import { useState, type ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import './Search.css';

interface SearchProps {
    onSearch: (term: string) => void;
    savedTerm?: string;
}

export function Search({ onSearch, savedTerm = '' }: SearchProps) {
    const t = useTranslations('search');
    const [searchTerm, setSearchTerm] = useState(savedTerm);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchClick = () => {
        onSearch(searchTerm.trim());
    };

    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                value={searchTerm}
                onChange={handleChange}
                placeholder={t('placeholder')}
            />
            <button type="button" className="btn" onClick={handleSearchClick}>
                {t('button')}
            </button>
        </div>
    );
}
