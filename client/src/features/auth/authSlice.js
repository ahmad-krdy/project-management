// features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser,getUser } from './authThunks';

const token = localStorage.getItem('token');

const authSlice = createSlice({
  name: 'auth',
  initialState: {user: null,token: (token || null),loading: (token) ? true : false,errorMessage: null,succesMessage:null},
  reducers: {
    clearMessages: (state) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
    logout: (state) => { 
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, registerUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
     .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem('token', action.payload.data.token);
        state.succesMessage = action.payload.message
      })
     .addCase(loginUser.rejected, registerUser.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message || 'Something went wrong';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        localStorage.setItem('token', action.payload.data.token);
        state.succesMessage = action.payload.message;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
       })
      .addCase(getUser.fulfilled, (state, action) => {
        // console.log("In auth slice:- ",action.payload.data);
        state.user = action.payload.data.user;
        state.loading = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false; 
        state.user = null;
        state.token = null;
        localStorage.removeItem('token');
      });
      
  },
});

export const { logout, setUser,clearMessages } = authSlice.actions;
export default authSlice.reducer;
