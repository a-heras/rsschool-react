import './Pagination.css';

interface PaginationProps {
    page: number;
    maxPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, maxPage, onPageChange }: PaginationProps) {
    return (
        <div className="pagination">
            <button
                type="button"
                className="btn"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
            >
                Prev
            </button>

            <span className="pagination-page">Page {page}</span>

            <button
                type="button"
                className="btn"
                disabled={page >= maxPage}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </div>
    );
}
