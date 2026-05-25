import "./SelectedItemsFlyout.css";

interface SelectedItemsFlyoutProps {
    count: number;
    onUnselectAll: () => void;
    onDownload: () => void;
}

function formatSelectedCount(count: number): string {
    return count === 1 ? "1 item selected" : `${count} items selected`;
}

export function SelectedItemsFlyout({ count, onUnselectAll, onDownload }: SelectedItemsFlyoutProps) {
    if (count === 0) return null;

    return (
        <div className="flyout" role="region" aria-label="Selected items">
            <p className="flyout-count">{formatSelectedCount(count)}</p>
            <div className="flyout-actions">
                <button type="button" className="btn btn--on-dark" onClick={onUnselectAll}>
                    Unselect all
                </button>
                <button type="button" className="btn btn--on-dark" onClick={onDownload}>
                    Download
                </button>
            </div>
        </div>
    );
}