import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    isLoading: false,
    error: null,
    message: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInUserStart: (state) => {
            state.isLoading = true;
        },
        signInUserSuccess: (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload.validUser.user; // Giữ user
            state.message = action.payload.message;
        },
        signInFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message;
        },
        resetMessage: (state) => {
            state.message = null;
        },
        resetError: (state) => {
            state.error = null;
        },
    },
});

export const { signInUserStart, signInUserSuccess, signInFailure, resetMessage, resetError } = userSlice.actions;
export default userSlice.reducer;
