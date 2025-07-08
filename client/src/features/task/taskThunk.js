import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchTasks = createAsyncThunk('tasks/fetch', async (filterParams={}, { rejectWithValue }) => {
  try {

    const queryString = new URLSearchParams(filterParams).toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (projectData, { rejectWithValue }) => {
  try {
    const res = await api.post('/tasks', projectData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const toggleTaskstatus = createAsyncThunk('tasks/update-status', async (taskData, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/update-status/${taskData.id}`, {column:taskData.field,value:taskData.value});
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateTaskProgress = createAsyncThunk('tasks/update-progress', async (taskData, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/update-progress/${taskData.id}`, {status:taskData.status});
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});



export const updateTask = createAsyncThunk('tasks/update', async (taskData, { rejectWithValue }) => {
  try {
    const res = await api.put(`/tasks/${taskData._id}`, taskData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/tasks/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});