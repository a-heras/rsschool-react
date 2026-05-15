import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import { SearchPage } from "./pages/SearchPage/SearchPage";
import { DetailsOutlet } from "./pages/DetailsPage/DetailsOutlet";
import { AboutPage } from "./pages/AboutPage/AboutPage";
import { Header } from "./layout/Header/Header";
import { Main } from "./layout/Main/Main";

export function App() {
    return (
        <ErrorBoundary>
            <Header />

            <Main>
                <Routes>
                    <Route path="/" element={<SearchPage />}>
                        <Route index element={<DetailsOutlet />} />
                    </Route>

                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Main>
        </ErrorBoundary>
    );
}

export default App;