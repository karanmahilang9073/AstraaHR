import asyncHandler from "../middlewares/asyncHandler.js"
import User from "../models/User.js"
import bcrypt from 'bcrypt'

// get users
export const getUsers = asyncHandler(async(req, res) => {
    if(!['HR','Admin'].includes(req.user.role)) {
        const error = new Error('unauthorized')
        error.statusCode = 403
        throw error
    }
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    let users
    if (req.user.role === "Admin") {
        users = await User.find({_id: {$ne: req.user._id}}).select("-password").sort({createdAt: -1}).skip((page - 1) * limit).limit(limit)
    } else {
        users = await User.find({role : "Employee"}).select("-password").sort({createdAt : -1}).skip((page - 1) * limit).limit(limit)
    }
    
    const total = req.user.role === 'Admin' ? await User.countDocuments({_id: {$ne: req.user._id}}) : await User.countDocuments({role: 'Employee'})
    res.status(200).json({ success: true, users, currentPage: page, totalPages: Math.ceil(total / limit), totalRecords: total})
})

// get single user profile
export const getUserProfile = asyncHandler(async(req, res) =>{
    const userId = req.user._id 
    const user = await User.findById(userId).select("-password")
    if (!user) {
        const error = new Error('user not found')
        error.statusCode = 404
        throw error
    }
    res.status(200).json({ success: true, message : 'user profile fetched successfully', user})
})

// update user
export const updateUser = asyncHandler(async(req, res) => {
    const { name, email, department, role } = req.body
    const userId = req.params.id

    const user = await User.findById(userId)
    if( !user) {
        const error = new Error ('user not found')
        error.statusCode = 404
        throw error
    }

    if(req.user.role === "Employee" && req.user._id.toString() !== user._id.toString()){
        const error = new Error("unauthorized")
        error.statusCode = 403
        throw error
    }
    if (req.user.role === "HR" && user.role !== "Employee") {
        const error = new Error("unauthorized")
        error.statusCode = 403
        throw error
    }

    if(name && !name.trim()) {
        const error = new Error('name cannot be empty')
        error.statusCode = 400
        throw error
    }

    if(email && !email.includes('@')) {
        const error = new Error('invalid email format')
        error.statusCode = 400
        throw error
    }
    if(department && !department.trim()) {
        const error = new Error('department cannot be empty')
        error.statusCode = 400
        throw error
    }

    if(email) {
        const emailNormalized = email.toLowerCase()
        const existing = await User.findOne({email : emailNormalized})
        if(existing && existing._id.toString() !== userId){
            const error = new Error('email already in use')
            error.statusCode = 409
            throw error
        }
        user.email = emailNormalized
    }
    user.name = name || user.name
    user.department = department || user.department
    if (req.user.role === "Admin" && role) {
        user.role = role
    }


    await user.save()
    res.status(200).json({ success: true, message:  "User updated successfully", 
        user : {
            id : user._id,
            name : user.name,
            email : user.email,
            role : user.role,
            department : user.department
        }
    })
})
 
export const deleteUser = asyncHandler(async(req, res) => {
    if (req.user.role !== "Admin") {
        const error = new Error('only admin can delete users')
        error.statusCode = 403
        throw error
    }
    const userId = req.params.id
    const user = await User.findById(userId)
    if ( !user) {
        const error = new Error('user not found')
        error.statusCode = 404
        throw error
    }
    if (user.role === "Admin") {
        const error = new Error("cannot delete another admin")
        error.statusCode = 403
        throw error
    }
    await user.deleteOne()
    res.status(200).json({ success : true, message: 'user deleted successfully'})
})

export const createUserByAdmin = asyncHandler(async(req, res) => {
    if(req.user.role !== 'Admin'){
        const error = new Error('only admin can create user')
        error.statusCode = 403
        throw error
    }

    const {name, email, password, department, role} = req.body
    if(!name || !email || !password || !role){
        const error = new Error('all fields are required')
        error.statusCode = 400
        throw error
    }

    if(!['HR', 'Admin'].includes(role)){
        const error = new Error('invalid role')
        error.statusCode= 400
        throw error
    }

    if(password.length < 6){
        const error = new Error('password must be at least 6 chaaracter')
        error.statusCode = 400
        throw error
    }

    const emailNormalized = email.toLowerCase()
    const existingUser = await User.findOne({email: emailNormalized})
    if(existingUser){
        const error = new Error('user already exists')
        error.statusCode = 409
        throw error
    }

    const hasehdpas = await bcrypt.hash(password, 10)

    const user = await User.create({name, email: emailNormalized, password: hasehdpas, department: department || 'General', role})

    res.status(201).json({success: true, message: 'user created successfully', 
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        }
    })
})