import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProjects = createAsyncThunk('projects/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/projects');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const createProject = createAsyncThunk('projects/create', async (projectData, { rejectWithValue }) => {
  try {
    const res = await api.post('/projects', projectData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const updateProject = createAsyncThunk('projects/update', async (projectData, { rejectWithValue }) => {
  try {
    const res = await api.put(`/projects/${projectData._id}`, {name:projectData.name,description:projectData.description,assignedMembers:projectData.assignedMembers});
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const deleteProject = createAsyncThunk('projects', async (id, { rejectWithValue }) => {
  try {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});

export const toggleProjectStatus = createAsyncThunk('projects/update-status', async (projectData, { rejectWithValue }) => {
  try {
    const res = await api.put(`/projects/update-status/${projectData.id}`,{status:projectData.status});
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data);
  }
});
