// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/App.css';
import { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes.js';
import { useSelector, useDispatch } from 'react-redux';
import { getUser } from '../src/features/auth/authThunks.js';

function App() {
  const dispatch = useDispatch();
  const { token,user,loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getUser());
    }
  }, [dispatch, token, user]);

  return (!loading)? <AppRoutes />:"";
}

export default App;
