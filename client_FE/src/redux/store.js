import userReducer from '../redux/Slice/userSlice';
import themeReducer from '../redux/Theme/ThemeSlice';
import storage from 'redux-persist/lib/storage'; // Chọn storage (localStorage mặc định)

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Cấu hình redux-persist
const persistConfig = {
    key: 'root', // key chính để lưu trữ state
    storage, // sử dụng localStorage
    version: 1,
};
const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer,
});
// Sử dụng persistReducer để kết hợp persistConfig và rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Tạo store với persistedReducer
export const store = configureStore({
    reducer: persistedReducer,
    // Thêm middleware mặc định để tương thích với redux-persist
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// Tạo persistor để điều khiển việc lưu và khôi phục store
export const persistor = persistStore(store);
