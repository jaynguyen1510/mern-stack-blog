// import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './routers/App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Tạo một QueryClient instance
const queryClient = new QueryClient();

// Render ứng dụng với QueryClientProvider
createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>,
    // </StrictMode>,
);
