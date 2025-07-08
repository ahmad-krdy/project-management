
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';


export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/dashboard-info');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);
