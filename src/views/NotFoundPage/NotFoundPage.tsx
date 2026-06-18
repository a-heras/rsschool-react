import Link from 'next/link';
import './NotFoundPage.css';

export function NotFoundPage() {
    return (
        <section className="notfound">
            <h1 className="notfound-title">404 — Page Not Found</h1>

            <p className="notfound-text">
                The page you are looking for does not exist.
            </p>

            <Link className="text-link" href="/">
                Go Home
            </Link>
        </section>
    );
}
