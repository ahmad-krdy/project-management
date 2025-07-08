const Task = require('../models/task.model');

exports.getTasks = async (req, res) => {
    try {

        let tasks;
        let filter = {};

        if (req.query.status && req.query.status !== 'all') {
                 filter.status = req.query.status;
        }

        const query = {status: (req.query.status && req.query.status!="all")? req.query.status:""}
        if (req.user.role === 'admin') {
            tasks = await Task.find({...filter })
                .populate('assignedTo', 'firstname lastname email role')
                .populate('projectId', 'name description')
                .populate('createdBy','firstname lastname');
        } else if (req.user.role === 'manager') {
            tasks = await Task.find({...filter,createdBy: req.user._id })
                .populate('assignedTo', 'firstname lastname email role')
                .populate('projectId', 'name description')
                .populate('createdBy','firstname lastname');
        } else {
           
            tasks = await Task.find({
                    ...filter,
                    assignedTo: req.user._id,
                    isActive:true,
                })
                .populate('assignedTo', 'firstname lastname email role')
                .populate('projectId', 'name description');
        }

        return res.status(200).json({ status: 'success', message: 'Tasks fetched successfully!', data: tasks });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};


exports.createTask = async (req, res) => {
    try {
        const { title, description, priority, projectId, assignedTo } = req.body;

        if (!title || !projectId) throw new Error('Title and Project ID are required!');

        const taskData = await Task.create({
            title,
            description,
            priority,
            projectId,
            assignedTo,
            createdBy: req.user._id,
        });

        if (!taskData) throw new Error('Some issue occurred while saving the task.');

        return res.status(200).json({ status: 'success', message: 'Task created successfully!' });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.toggleTaskStatus = async (req,res) => {
    try{
          const {column,value} = req.body
          const updatedTask = await Task.findByIdAndUpdate(req.params.id,{[column]:value}, { new: true });
          if (!updatedTask) throw new Error('Some issue occurred while update the task status.');

          return res.status(200).json({status:"success",message:"Task status updated!",data:{_id:updatedTask._id,isActive:updatedTask.isActive}});
    } catch (error) {
       res.status(500).json({status:"error",message: error.message });
    }
}

exports.updateTaskProgress = async (req,res) => {
    try{
          const {status} = req.body
          const updatedTask = await Task.findByIdAndUpdate(req.params.id,{status}, { new: true });
          if (!updatedTask) throw new Error('Some issue occurred while update the task status.');
          return res.status(200).json({status:"success",message:`Task updated to ${status}!`,data:{_id:updatedTask._id,status:updatedTask.status}});
    } catch (error) {
       res.status(500).json({status:"error",message: error.message });
    }
}

exports.updateTask = async (req, res) => {
    try {
        const { title, description, priority, projectId, assignedTo } = req.body;

        if (!title || !projectId) throw new Error('Title and Project ID are required!');

        const taskUpdated = await Task.findByIdAndUpdate(req.params.id,{
            title,
            description,
            priority,
            projectId,
            assignedTo,
        },{new:true});

        if (!taskUpdated) throw new Error('Some issue occurred while updating the task.');

        const populatedTask = await Task.findById(taskUpdated._id)
            .populate('projectId', 'name description')
            .populate('assignedTo', 'firstname lastname role')
            .populate('createdBy', 'firstname lastname');

        return res.status(200).json({ status: 'success', message: 'Task updated successfully!',data:populatedTask });
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};

exports.deleteTask = async (req,res)=>{
    try {

        // await Project.findByIdAndUpdate(req.params.id);
        // const softDeletedProject = await Project.findByIdAndUpdate(req.params.id,{
        //   isDelete:true
        // }, { new: true });

        const hardDeletedTask = await Task.findByIdAndDelete(req.params.id);

        if(!hardDeletedTask) throw new Error("TaskID is invalid!");
        return res.status(200).json({status:"success",message:"Task deleted succesfully!",data:{_id:req.params.id}});
    
    } catch (error) {
       res.status(500).json({status:"error",message: error.message });
    }
}
