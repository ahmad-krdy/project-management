require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db.config');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth',require('./routes/auth.route'));
app.use('/api/projects',require('./routes/project.route'));
app.use('/api/tasks',require('./routes/task.route'));
app.use('/api/dashboard-info',require('./routes/dashboard.route'));

connectDB();
const PORT = process.env.PORT || 5001
app.listen(PORT,()=>{
    console.log(`server running on ${PORT}`);
});

