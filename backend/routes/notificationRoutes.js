import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import {createNotification, getMyNotifications, markAsRead ,markAllAsRead, deleteNotification} from '../controllers/notificationController.js'

const notificationRouter = express.Router()

notificationRouter.post('/', authMiddleware, createNotification)
notificationRouter.get('/my', authMiddleware, getMyNotifications)
notificationRouter.put('/read-all', authMiddleware, markAllAsRead)
notificationRouter.patch('/:id/read', authMiddleware, markAsRead)
notificationRouter.delete('/:id', authMiddleware, deleteNotification)

export default notificationRouter