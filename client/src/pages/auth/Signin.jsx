import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate,Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authThunks';
import loader from '../../assets/button-loader.gif';

export default function Signin() {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    handleValidation(e.target.name);
  };

  const handleValidation = (field = 'all') => {
    let errors = { ...formError };
    let isError = false;

    if (field === 'all' || field === 'email') {
      if (!loginData.email) {
        errors.email = 'Enter email';
        isError = true;
      } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
        errors.email = 'Enter valid email';
        isError = true;
      } else {
        errors.email = '';
      }
    }

    if (field === 'all' || field === 'password') {
      if (!loginData.password) {
        errors.password = 'Enter password';
        isError = true;
      } else {
        errors.password = '';
      }
    }

    setFormError(errors);
    return isError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
        setLoading(true);
        const result = await dispatch(loginUser(loginData));
        if (result.meta.requestStatus === 'fulfilled') {
            navigate('/dashboard');
        }
        else if(result.meta.requestStatus === 'rejected'){
            toast.error(result.payload.message);
        }
        // console.log("result:- ",result);

        setLoading(false);
    }
  };

  return (
    <section className='d-flex justify-content-center align-items-center login-container w-100'>
      <div className='login-form'>
        <div className="mb-4">
          <h5 className="fw-bold" style={{ color: '#22218b', letterSpacing: '1px' }}>
            Task<span style={{ color: '#f0ad4e' }}>Flow</span>
          </h5>
        </div>
        <p className="form-text poppins-regular">Welcome user!</p>
        <p className="poppins-bold mb-3" style={{ fontSize: '21px', lineHeight: '0.1px' }}>
          Login to your account
        </p>
        <form className='mt-5'>
          <div className="mb-3">
            <label className="form-label poppins-regular" style={{ fontSize: '14px' }}>Email</label>
            <input
              type="email"
              className={`form-control bg-light poppins-medium ${formError.email ? 'form-input-error' : ''}`}
              placeholder='Enter email'
              name="email"
              style={{ padding: '9px', fontSize: '15px' }}
              onChange={handleChange}
              value={loginData.email}
              autoComplete="off"
            />
            {formError.email && <span className="form-label-error d-block mt-1">{formError.email}</span>}
          </div>
          <div className="mb-3">
            <label className="form-label poppins-regular" style={{ fontSize: '14px' }}>Password</label>
            <input
              type="password"
              className={`form-control bg-light poppins-medium ${formError.password ? 'form-input-error' : ''}`}
              placeholder='Enter password'
              name="password"
              style={{ padding: '10px', fontSize: '15px' }}
              onChange={handleChange}
              value={loginData.password}
              autoComplete="off"
            />
            {formError.password && <span className="form-label-error d-block mt-1">{formError.password}</span>}
          </div>
            <button
                type="submit"
                className="btn mt-4 w-100"
                style={{ height: "50px", backgroundColor: "#22218b", color: "white" }}
                onClick={handleLogin}
                disabled={loading}
            >
            {loading ? (
              <div className='loader-container' style={{ height: "100%" }}>
                <img src={loader} alt="Loading..." style={{ height: "100%" }} />
              </div>
            ) : (
              "Login"
            )}
          </button>

          <div className='d-flex justify-content-center mt-4'>
             <p> Don't have an account ? <Link to='/signup'>Signup</Link> </p>
          </div>
        </form>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </section>
  );
}
