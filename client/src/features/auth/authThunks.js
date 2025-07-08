import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// Login Thunk
export const loginUser = createAsyncThunk('auth/loginUser', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signin', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Signup Thunk
export const registerUser = createAsyncThunk('auth/registerUser', async (formData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getUser = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

