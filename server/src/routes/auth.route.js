const express = require('express');
const authRoute = express.Router();
const {signup,signin,assignRole,getUserProfile,getUsers} = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');


authRoute.post('/signup',signup);
authRoute.post('/signin',signin);
authRoute.get('/me',authMiddleware,getUserProfile);
authRoute.get('/members',authMiddleware,verifyRole('admin','manager'),getUsers);
authRoute.put('/assign-role',authMiddleware,verifyRole('admin'),assignRole);

module.exports = authRoute;