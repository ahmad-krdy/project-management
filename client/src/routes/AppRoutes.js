import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from "../pages/auth/Signin.jsx";
import Signup from "../pages/auth/Signup.jsx";
import Dashboard from '../pages/Dashboard.jsx';
import Project from '../pages/Project.jsx';
import Member from '../pages/Member.jsx';
import NotAccessible from '../pages/NotAccessible.jsx'
import Task from '../pages/Task.jsx';

function PrivateRoute({ children,allowedRoles }) {
    const { token,user } = useSelector(state => state.auth);

    if(!token)
      return <Navigate to="/" />

    if(allowedRoles && !allowedRoles.includes(user.role)){
      return <Navigate to="/not-accessible" />;
    }

    return children;
}


function PublicRoute({ children }) {
  const { token } = useSelector(state => state.auth);
  return token ? <Navigate to="/dashboard" /> : children;
}

export default function AppRoutes() {
  // const dispatch = useDispatch();
  // const { token, user } = useSelector(state => state.auth);

  // // On page load, fetch user info if token exists but user not loaded
  // useEffect(() => {
  //   console.log("Checking for token to fetch user:", token);
  //   if (token) {
  //     dispatch(getUser());
  //   }
  // }, [dispatch, token]);


  // console.log(user);

  return (
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Signin />
          </PublicRoute>
        } />

        <Route path="/signup" element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/members" element={
          <PrivateRoute allowedRoles={["admin","manager"]}>
            <Member />
          </PrivateRoute>
        } />

        <Route path="/projects" element={
          <PrivateRoute allowedRoles={["admin","manager"]}>
            <Project />
          </PrivateRoute>
        } />

        <Route path="/tasks" element={
          <PrivateRoute>
            <Task />
          </PrivateRoute>
        } />

        <Route path="/not-accessible" element={
          <PrivateRoute>
            <NotAccessible />
          </PrivateRoute>
        } />
      </Routes>
  );
}