import express from 'express'
import { login, sendVerificationCode, userRegister, userResetPassword } from '../controller/userController'
import { authLimiter, verificationLimiter } from '../middleware/limiter'

const userRouter = express.Router()

userRouter.post('/login', authLimiter, login)

userRouter.post('/send-verification-code', verificationLimiter, sendVerificationCode)

userRouter.post('/register', authLimiter, userRegister)

userRouter.post('/reset-password', authLimiter, userResetPassword)

export default userRouter
