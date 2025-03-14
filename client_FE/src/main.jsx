import App from './routers/App';
import './index.css';
import ThemeProvider from './components/ThemeComponent/ThemeComponent';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store, persistor } from './redux/store'; // Import cả store và persistor
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
// import { StrictMode } from 'react';

// Tạo một QueryClient instance
const queryClient = new QueryClient();

// Render ứng dụng với QueryClientProvider và PersistGate
createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    </QueryClientProvider>,
    /* </StrictMode>, */
);
