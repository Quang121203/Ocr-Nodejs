import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: '',
    isAdmin: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload.username;
            state.isAdmin = action.payload.isAdmin;
        },
        logout: (state) => {
            state.username = initialState.username;
            state.isAdmin = initialState.isAdmin;
        }
    },
})

export const { login, logout } = userSlice.actions

export const selectUser = (state) => state.user

export default userSlice.reducer
