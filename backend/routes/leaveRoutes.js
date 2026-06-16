import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {applyLeave, getLeaves, updateLeaveStatus, revokeLeave, deleteLeave} from '../controllers/leaveController.js'

const leaveRouter = express.Router()

leaveRouter.post('/apply', authMiddleware, applyLeave)
leaveRouter.get('/',authMiddleware, getLeaves)
leaveRouter.put('/revoke/:id', authMiddleware, revokeLeave)
leaveRouter.patch('/:id/status', authMiddleware, updateLeaveStatus)
leaveRouter.delete('/:id', authMiddleware, deleteLeave)

export default leaveRouter
