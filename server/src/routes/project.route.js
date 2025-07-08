const express = require('express');
const projectRoute = express.Router();
const {createProject,updateProject,deleteProject,getProjects,toggleStatus} = require('../controllers/project.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const verifyRole = require('../middlewares/role.middleware');


projectRoute.get('/',authMiddleware,getProjects);
projectRoute.post('/',authMiddleware,verifyRole('admin','manager'),createProject);
projectRoute.put('/update-status/:id',authMiddleware,toggleStatus);
projectRoute.put('/:id',authMiddleware,updateProject);
projectRoute.delete('/:id',deleteProject);

// projectRoute.get('/:id',authMiddleware,getProjectByID);
// authRoute.post('/assign-role',authMiddleware,verifyRole('admin'),assignRole);

module.exports = projectRoute;