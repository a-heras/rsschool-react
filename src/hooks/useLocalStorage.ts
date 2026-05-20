import { useState } from "react";

export function useLocalStorage(key: string, initialValue = "") {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            return localStorage.getItem(key) ?? initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = (value: string) => {
        try {
            localStorage.setItem(key, value);
        } catch {
            
        }
        setStoredValue(value);
    };

    return [storedValue, setValue] as const;
}
