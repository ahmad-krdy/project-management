const Project = require('../models/project.model');
const Task = require('../models/task.model');
const User = require('../models/user.model');

exports.getDashboardData = async (req, res) => {
  try {
    const role = req.user.role;
    const userId = req.user._id;

    let projectFilter = { isDelete: false };
    let taskFilter = {};

    if (role === 'manager') {
      projectFilter.createdBy = userId;
      taskFilter.createdBy = userId;
    } else if (role === 'employee') {
      taskFilter.assignedTo = userId;
    }

    const [totalProjects, totalTasks, totalUsers] = await Promise.all([
      Project.countDocuments(projectFilter),
      Task.countDocuments(taskFilter),
      role === 'admin'
        ? User.countDocuments({ role: { $in: ['manager', 'employee'] } })
        : role === 'manager'
        ? User.countDocuments({ role: 'employee' })
        : 0,
    ]);

    let completedTasks;
    let pendingTasks;
    if (role === 'employee') {
        // totalTasks = await Task.countDocuments({ assignedTo: req.user._id, isActive: true });
        completedTasks = await Task.countDocuments({ assignedTo: req.user._id, isActive: true, status: 'Completed' });
        pendingTasks = await Task.countDocuments({ assignedTo: req.user._id, isActive: true, status: 'In-Progress' });
    }

    const taskStatus = await Task.aggregate([
      { $match: taskFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const taskStatusCounts = taskStatus.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    let projectStatusCounts = {};
    if (role === 'admin') {
      const projectStatus = await Project.aggregate([
        { $match: projectFilter },
        { $group: { _id: '$isActive', count: { $sum: 1 } } },
      ]);
      projectStatusCounts = projectStatus.reduce((acc, item) => {
        acc[item._id ? 'Active' : 'Inactive'] = item.count;
        return acc;
      }, {});
    }

    const monthlyProjectsData = await Project.aggregate([
      { $match: projectFilter },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyProjects = monthNames.map((name, index) => {
      const found = monthlyProjectsData.find(m => m._id.month === index + 1);
      return { name, Projects: found ? found.count : 0 };
    });

    return res.status(200).json({
      status: 'success',
      message: 'Dashboard data fetched successfully!',
      data: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        totalUsers,
        taskStatusCounts,
        projectStatusCounts,
        monthlyProjects,
      },
    });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};
