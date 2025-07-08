import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../features/dashboard/dashboardThunks';
import Navbar from '../components/layout/Navbar';
import loader from '../assets/loader.gif';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { dashboardData, loading } = useSelector(state => state.dashboard);

useEffect(() => {
  
    dispatch(fetchDashboardData());
    console.log("asdsdsd:- ",dashboardData);
}, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Dashboard</h2>
        <p>Welcome, {user.firstname}! You are logged in as <strong>{user.role.toUpperCase()}</strong>.</p>

        {
          (!loading && dashboardData)
          ?
          (
            <>
            <div className="row">
              <div className="col-md-4">
                <div className="card text-white bg-success mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{ (user.role === "employee")? "Total Task": "Total Projects" }</h5>
                    <p className="card-text">{(user.role === "employee") ? dashboardData.totalTasks: dashboardData.totalProjects}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-warning mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{ (user.role === "employee")? "Total Completed Task": "Total Task" }</h5>
                    <p className="card-text">{(user.role === "employee") ? dashboardData.completedTasks: dashboardData.totalTasks}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-white bg-info mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{ (user.role === "employee")? "Total Pending Task": "Total Users" }</h5>
                    <p className="card-text">{(user.role === "employee") ? dashboardData.pendingTasks: dashboardData.totalUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-md-6">
                <h5 className="text-center mb-3">Projects Per Month</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.monthlyProjects}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="col-md-6">
                <h5 className="text-center mb-3">Tasks by Status</h5>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={Object.entries(dashboardData.taskStatusCounts).map(([status, count]) => ({ name: status, value: count }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label
                    >
                      {Object.entries(dashboardData.taskStatusCounts).map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            </>
          )
        :
            <div className='loader-container' style={{height:"70vh"}}>
                 <img src={loader} alt="" style={{height:"70px"}}/>
            </div>
        }
      </div>
    </div>
  );
}
