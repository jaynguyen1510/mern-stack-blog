import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    theme: 'light',
};
const themeLight = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export const { toggleTheme } = themeLight.actions;
export default themeLight.reducer;