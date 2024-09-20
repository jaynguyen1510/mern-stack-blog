// import { StrictMode } from 'react';
import App from './routers/App';
import './index.css';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './redux/store';
import { Provider } from 'react-redux';
// Tạo một QueryClient instance
const queryClient = new QueryClient();

// Render ứng dụng với QueryClientProvider
createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </Provider>,
    // </StrictMode>,
);
