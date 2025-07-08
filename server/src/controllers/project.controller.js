const Project = require('../models/project.model');
const Task = require('../models/task.model');

exports.getProjects = async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
         projects = await Project.find()
                    .populate('assignedMembers', 'firstname lastname email role')
                    .populate('createdBy', 'firstname lastname email role')
    } else if (req.user.role === 'manager') {
         projects = await Project.find({
                    $or: [
                        { createdBy: req.user._id },               
                        { assignedMembers: req.user._id }  
                    ],
                    isDelete: false,
                    })
                    .populate('assignedMembers', 'firstname lastname email role')
                    .populate('createdBy', 'firstname lastname email role');
    } 

    res.status(200).json({ status: 'success', message: 'All projects fetched successfully!', data: projects });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};


exports.createProject = async (req, res) => {
    try {
        const { name, description, assignedMembers } = req.body;

        if (!name || !description) throw new Error('All fields are required!');

        const projectData = await Project.create({
        name,
        description,
        assignedMembers, // save assigned member ids
        createdBy: req.user._id,
        });

        if (!projectData) throw new Error('Some issue occurred while saving the project.');

        return res.status(200).json({ status: 'success', message: 'Project created successfully!' });

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error.message });
    }
};
exports.updateProject = async (req,res)=>{
    try {
        const { id } = req.params;
        const {name,description} = req.body;
        if(!name || !description) throw new Error("All field are required!");

        const updatedProject = await Project.findByIdAndUpdate(id,req.body, { new: true });

        if(!updatedProject) throw new Error("ProjectID is invalid!");
        return res.status(200).json({status:"success",message:"Project updated succesfully!"});

    } catch (error) {
        res.status(500).json({status:"error",message: error.message });
    }
}


exports.deleteProject = async (req,res)=>{
    try {

        const taskCount = await Task.countDocuments({ projectId: req.params.id });
        if (taskCount > 0) throw new Error("Cannot delete project. There are existing tasks assigned to this project!");
        
        const hardDeletedProject = await Project.findByIdAndDelete(req.params.id);

        if(!hardDeletedProject) throw new Error("ProjectID is invalid!");
        return res.status(200).json({status:"success",message:"Project deleted succesfully!",data:{_id:req.params.id}});
    
    } catch (error) {
       res.status(500).json({status:"error",message: error.message });
    }
}

exports.toggleStatus = async (req,res) => {
    try{
          const {status} = req.body
          const updatedProject = await Project.findByIdAndUpdate(req.params.id,{
          isActive:status
          }, { new: true });

          return res.status(200).json({status:"success",message:"Project status updated!",data:{_id:updatedProject._id,isActive:updatedProject.isActive}});
    } catch (error) {
       res.status(500).json({status:"error",message: error.message });
    }
}