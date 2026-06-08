import { useState } from 'react';
import './ErrorButton.css';

export function ErrorButton() {
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
                Throw Error
            </button>
        </div>
    );
}
