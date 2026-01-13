import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./routers/MainRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <MainRouter />
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
}

export default App;