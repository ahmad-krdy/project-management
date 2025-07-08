import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function NotAccessible() {
  return (
    <>
        <Navbar />
        <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
        <div className="card text-center p-4" style={{ maxWidth: '500px' }}>
            <h3 className="mb-3 text-danger">Access Denied</h3>
            <p className="mb-4">Sorry, you do not have permission to view this page.</p>
            <Link to="/dashboard" className="btn btn-primary">
               Go to Dashboard
            </Link>
        </div>
        </div>
    </>
  );
}
