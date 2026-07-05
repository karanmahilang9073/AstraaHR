import express from 'express'
import {getUsers, updateUser, deleteUser, getUserProfile, createUserByAdmin} from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.get('/profile', authMiddleware, getUserProfile)
userRouter.get('/', authMiddleware, getUsers)
userRouter.put('/:id',authMiddleware, updateUser)
userRouter.delete('/:id',authMiddleware, deleteUser)
userRouter.post('/create', authMiddleware, createUserByAdmin)

export default userRouter
