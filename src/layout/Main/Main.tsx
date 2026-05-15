import { type ReactNode } from "react";
import "./Main.css";

interface MainProps {
    search: ReactNode;
    results: ReactNode;
}

export function Main({search, results}: MainProps) {
    return (
        <div className="main-container">
            <div className="top-controls">
                {search}
            </div>

            <div className="results-section">
                {results}
            </div>
        </div>
    );
}