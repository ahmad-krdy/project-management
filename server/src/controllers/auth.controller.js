const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req,res)=>{
   try {
        const {firstname,lastname,email,password} = req.body;

        if(!firstname || !lastname || !email || !password) throw new Error("All field are required!");

        const checkExistUser = await User.findOne({email});
        if(checkExistUser) throw new Error("Email already exist!");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        const  user = await User.create({
            firstname,
            lastname,
            email,
            password:hashedPassword
        });

        const token = jwt.sign({user_id:user._id},process.env.JWT_SECRETKEY,{
            expiresIn:"1h" 
        })

        if(token){
            res.status(200).json({status:"success",message:"Signup done succesfully!",data:{user:{firstname:user.firstname,email:user.email,role:user.role},token}});
        }
   } catch (error) {
        return res.status(500).json({status:"error",message:error.message});
   }
}


exports.signin = async (req,res)=>{
    try {
        
        const {email,password} = req.body;
        if(!email || !password) throw new Error("All field are required!");

        const userData = await User.findOne({email});
        if(!userData) throw new Error("Invalid crediential");

        const passwordMatch = await bcrypt.compare(password,userData.password);
        if(!passwordMatch) throw new Error("Invalid crediential");

        const token = jwt.sign({user_id:userData._id},process.env.JWT_SECRETKEY,{
            expiresIn:"1h"
        })
        if(token){
            res.status(200).json({status:"success",message:"Signin done succesfully!",data:{user:{firstname:userData.firstname,email:userData.email,role:userData.role},token}});
        }

    } catch (error) {
        return res.status(500).json({status:"error",message:error.message});
    }
}

exports.assignRole = async (req,res)=>{
    try {
        const {user_id,role} = req.body;
        if(!user_id || !role) throw new Error("Userid & Role field are required!");

        const updatedUser = await User.findByIdAndUpdate(user_id,{role},{new:true});
        if(!updatedUser) throw new Error("User not found for assign role!");

        return res.status(200).json({status:"success",message:"Role assigned succesfully!",data:{_id:user_id,role}});
    } catch (error) {
        return res.status(500).json({status:"error",message:error.message});
    }
}

exports.getUserProfile = async (req,res)=>{
    try {
        // console.log("User:- ",req.user);
        // const currentUser = await User.findById(req.user._id);
        // if(!currentUser) throw new Error("User not found!");
        return res.status(200).json({status:"success",message:"User fecthed succesfully!",data:{user:req.user}});
    } catch (error) {
        return res.status(500).json({status:"error",message:error.message});
    }
}

exports.getUsers = async (req, res) => {
  try {
    const currentUserRole = req.user.role;
    let query = {};

    if (currentUserRole === 'admin') {
        if(req.query.role && req.query.role!="all"){
            query.role = req.query.role
        }else{
            query.role = { $in: ['manager', 'employee'] };
        }
    } else if (currentUserRole === 'manager') {
        query.role = 'employee';
    }

    const users = await User.find(query).select('-password');
    return res.status(200).json({status:"success",message:"Members fecthed succesfully!",data:users});

  } catch (error) {
     return res.status(500).json({status:"error",message:error.message});
  }
};

 