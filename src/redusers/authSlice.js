import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
    },
    reducers: {
        clearUser: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { clearUser } = authSlice.actions;
export default authSlice.reducer;
