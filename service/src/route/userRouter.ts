import express from 'express'
import { auth } from 'src/middleware/auth'
import { rootAuth } from 'src/middleware/rootAuth'
import { getUserInfoController, getUsersController, login, sendVerificationCode, updateUserInfoController, updateUserRoleController, updateUserStatusController, userRegister, userResetPassword } from '../controller/userController'
import { authLimiter, verificationLimiter } from '../middleware/limiter'

const userRouter = express.Router()

userRouter.post('/login', authLimiter, login)
userRouter.post('/send-verification-code', verificationLimiter, sendVerificationCode)
userRouter.post('/register', authLimiter, userRegister)
userRouter.post('/reset-password', authLimiter, userResetPassword)
userRouter.post('/update-info', auth, updateUserInfoController)
userRouter.post('/get-info', auth, getUserInfoController)
userRouter.get('/all-user', rootAuth, getUsersController)
userRouter.post('/update-status', rootAuth, updateUserStatusController)
userRouter.post('/update-role', rootAuth, updateUserRoleController)

export default userRouter
