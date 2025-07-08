import { createSlice } from '@reduxjs/toolkit';
import { fetchDashboardData } from './dashboardThunks';



const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {loading: false,dashboardData: null,errorMessage: null},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload.data;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
