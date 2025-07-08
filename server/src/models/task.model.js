const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
        title:{
            type:String,
            required:true
        },
        description:{
            type:String
        },
        priority:{
            type:String,
            enum:['High', 'Medium','Low'],
            default:'null'
        },
        projectId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Project'
        },
        status:{
            type:String,
            enum:['In-Progress', 'Completed'],
            default:'In-Progress'
        },
        assignedTo:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User'
        },
        isActive:{
            type:Boolean,
            default:true
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }, 
},{timestamps:true});

module.exports = mongoose.model('Task',taskSchema);