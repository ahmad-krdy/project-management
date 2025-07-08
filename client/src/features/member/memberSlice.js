// src/redux/slices/memberSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMembers,assignRole } from './memberThunks';

const memberSlice = createSlice({
  name: 'members',
  initialState: { members: [],loading_member: false,errorMessage: null,successMessage:null },
  reducers: {
    clearMessages: (state) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading_member = true;
        state.errorMessage = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading_member = false;
        state.members = action.payload.data;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading_member = false;
        state.errorMessage = action.payload;
      })
      .addCase(assignRole.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedRole = action.payload.data
        const index = state.members.findIndex(m => m._id === updatedRole._id);
        if (index !== -1) {
            state.members[index].role= updatedRole.role;
        }
      })
      .addCase(assignRole.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
      });
  },
});

export const {clearMessages } = memberSlice.actions;
export default memberSlice.reducer;
