import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: '',
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
            // Kiểm tra sự tồn tại của các thuộc tính
            const user = action.payload.validUser?.user || action.payload.userGoogle?.user;
            if (user) {
                state.currentUser = user;
                state.message = action.payload.message;
            } else {
                console.error('Không tìm thấy user trong payload:', action.payload);
            }
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
        removeUserCurrent(state) {
            state.currentUser = '';
            state.isLoading = false;
            state.error = null;
            state.message = null;
        },
    },
});

export const { signInUserStart, signInUserSuccess, signInFailure, resetMessage, resetError, removeUserCurrent } =
    userSlice.actions;
export default userSlice.reducer;
