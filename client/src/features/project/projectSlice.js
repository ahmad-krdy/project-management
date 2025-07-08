import { createSlice } from '@reduxjs/toolkit';
import { fetchProjects, createProject, updateProject, deleteProject,toggleProjectStatus } from './projectThunks';

const projectSlice = createSlice({
  name: 'project',
  initialState: { projects: [], loading: false, errorMessage: null,successMessage:null },
  reducers: {
    clearMessages: (state) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => { state.loading = true; state.errorMessage = null; })
      .addCase(fetchProjects.fulfilled, (state, action) => { state.projects = action.payload.data; state.loading = false; })
      .addCase(fetchProjects.rejected, (state, action) => { state.loading = false; state.errorMessage = action.payload; })

      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload?.message || 'Create failed';
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload.data;
        // const index = state.projects.findIndex(p => p._id === updatedProject._id);
        // if (index !== -1) {
        //   state.projects[index] = updatedProject;
        // }
        state.successMessage = action.payload.message;
       })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload || 'Update failed';
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.projects = state.projects.filter(p => p._id !== action.payload.data._id);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(toggleProjectStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedProject = action.payload.data;
        const index = state.projects.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
            state.projects[index].isActive= updatedProject.isActive;
        }
      })
      .addCase(toggleProjectStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = projectSlice.actions;
export default projectSlice.reducer;