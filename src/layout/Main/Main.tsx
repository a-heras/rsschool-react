import { type ReactNode } from 'react';
import './Main.css';

interface MainProps {
    children: ReactNode;
}

export function Main({ children }: MainProps) {
    return <main className="main-container">{children}</main>;
}
