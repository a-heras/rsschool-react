import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import { SearchPage } from "./pages/SearchPage/SearchPage";
import { DetailsOutlet } from "./pages/DetailsPage/DetailsOutlet";

export function App() {
    return (
        <ErrorBoundary>
            <Routes>
                <Route path="/" element={<SearchPage />}>
                    <Route index element={<DetailsOutlet />} />
                </Route>
            </Routes>
        </ErrorBoundary>
    );
}

export default App;