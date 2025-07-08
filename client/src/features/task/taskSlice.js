import { createSlice } from '@reduxjs/toolkit';
import { fetchTasks, createTask,toggleTaskstatus,updateTask,deleteTask,updateTaskProgress} from './taskThunk';

const taskSlice = createSlice({
  name: 'task',
  initialState: { tasks: [], task_loading: false, errorMessage: null,successMessage:null },
  reducers: {
    clearMessages: (state) => {
      state.errorMessage = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.task_loading = true; state.errorMessage = null; })
      .addCase(fetchTasks.fulfilled, (state, action) => { state.tasks = action.payload.data; state.task_loading = false; })
      .addCase(fetchTasks.rejected, (state, action) => { state.task_loading = false; state.errorMessage = action.payload.message; })
      .addCase(createTask.fulfilled, (state, action) => {
        state.task_loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.task_loading = false;
        state.errorMessage = action.payload?.message || 'Create failed';
      })
      .addCase(toggleTaskstatus.fulfilled, (state, action) => {
        state.task_loading = false;
        state.successMessage = action.payload.message;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
            state.tasks[index].isActive= updatedTask.isActive;
        }
      })
      .addCase(toggleTaskstatus.rejected, (state, action) => {
        state.task_loading = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.task_loading = false;
        const updatedProject = action.payload.data;
        const index = state.tasks.findIndex(p => p._id === updatedProject._id);
        if (index !== -1) {
          state.tasks[index] = updatedProject;
        }
        state.successMessage = action.payload.message  ;
        })
      .addCase(updateTask.rejected, (state, action) => {
        state.task_loading = false;
        state.errorMessage = action.payload.message || 'Update failed';
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.task_loading = false;
        state.successMessage = action.payload.message;
        state.tasks = state.tasks.filter(p => p._id !== action.payload.data._id);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.task_loading = false;
        state.errorMessage = action.payload.message;
      })
      .addCase(updateTaskProgress.fulfilled, (state, action) => {
        state.task_loading = false;
        state.successMessage = action.payload.message;
        const updatedTask = action.payload.data;
        const index = state.tasks.findIndex(t => t._id === updatedTask._id);
        if (index !== -1) {
            state.tasks[index].status= updatedTask.status;
        }
      })
      .addCase(updateTaskProgress.rejected, (state, action) => {
        state.task_loading = false;
        state.errorMessage = action.payload.message;
      })
      
  },
});

export const { clearMessages } = taskSlice.actions;
export default taskSlice.reducer;