const express = require('express');
const taskRoute = express.Router();
const {createTask,getTasks,toggleTaskStatus,updateTask,deleteTask,updateTaskProgress} = require('../controllers/task.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');


taskRoute.post('/',authMiddleware,verifyRole('admin','manager'),createTask);
taskRoute.get('/',authMiddleware,getTasks);
taskRoute.put('/update-status/:id',authMiddleware,verifyRole('admin','manager'),toggleTaskStatus);
taskRoute.put('/update-progress/:id',authMiddleware,updateTaskProgress);
taskRoute.put('/:id',authMiddleware,verifyRole('admin','manager'),updateTask);
taskRoute.delete('/:id',authMiddleware,verifyRole('admin','manager'),deleteTask);

module.exports = taskRoute;