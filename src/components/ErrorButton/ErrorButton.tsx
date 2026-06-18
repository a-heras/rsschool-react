'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import './ErrorButton.css';

export function ErrorButton() {
    const t = useTranslations('error');
    const [throwError, setThrowError] = useState(false);

    if (throwError) {
        throw new Error('Test error triggered by ErrorButton');
    }

    return (
        <div className="error-button-container">
            <button
                className="error-trigger-button"
                onClick={() => setThrowError(true)}
            >
                {t('throwButton')}
            </button>
        </div>
    );
}
