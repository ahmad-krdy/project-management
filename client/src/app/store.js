import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import projectReducer from "../features/project/projectSlice"
import memberReducer from "../features/member/memberSlice";
import taskReducer from '../features/task/taskSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    project:projectReducer,
    members:memberReducer,
    task:taskReducer,
    dashboard:dashboardReducer
  },
});
