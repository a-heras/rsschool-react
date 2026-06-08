import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './error-boundary/ErrorBoundary';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { DetailsOutlet } from './pages/DetailsPage/DetailsOutlet';
import { AboutPage } from './pages/AboutPage/AboutPage';
import { Header } from './layout/Header/Header';
import { Main } from './layout/Main/Main';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';
import './App.css';

export function App() {
    return (
        <ErrorBoundary>
            <div className="app-view">
                <Header />

                <Main>
                    <Routes>
                        <Route path="/" element={<SearchPage />}>
                            <Route index element={<DetailsOutlet />} />
                        </Route>

                        <Route path="/about" element={<AboutPage />} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </Main>
            </div>
        </ErrorBoundary>
    );
}

export default App;
