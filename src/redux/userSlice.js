import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    username: ''
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            state.username = action.payload.username;
        },
        logout: (state) => {
            state.username = initialState.username;
        }
    },
})

export const { login, logout } = userSlice.actions

export const selectUser = (state) => state.user

export default userSlice.reducer
