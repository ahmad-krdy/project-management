import api from '../../utils/api';
import {createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMembers = createAsyncThunk('members/fetchMembers', async (filterParams={}, thunkAPI) => {
    try {

        const queryString = new URLSearchParams(filterParams).toString();
        const url = queryString ? `/auth/members?${queryString}` : '/auth/members';
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch members');
    }
});

export const assignRole = createAsyncThunk('auth/assign-role',async (userData, { rejectWithValue }) => {
    try {
      const response = await api.put('/auth/assign-role',userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign role');
    }
  }
);