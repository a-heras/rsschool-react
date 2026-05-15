import "./Pagination.css";

interface PaginationProps {
    page: number;
    maxPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({page, maxPage, onPageChange}: PaginationProps) {
    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                ← Prev
            </button>

            <span className="pagination-page">Page {page}</span>

            <button
                className="pagination-btn"
                disabled={page >= maxPage}
                onClick={() => onPageChange(page + 1)}
            >
                Next →
            </button>
        </div>
    );
}