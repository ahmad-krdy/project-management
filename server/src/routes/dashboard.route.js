const express = require('express');
const dashboardRoute = express.Router();
const { getDashboardData } = require('../controllers/dashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');

dashboardRoute.get('/', authMiddleware, getDashboardData);

module.exports = dashboardRoute;