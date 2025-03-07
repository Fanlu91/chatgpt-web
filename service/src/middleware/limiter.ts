import { rateLimit } from 'express-rate-limit'
import * as dotenv from 'dotenv'
import { isNotEmptyString } from '../utils/is'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requestIp = require('request-ip')
dotenv.config()

const MAX_REQUEST_PER_HOUR = process.env.MAX_REQUEST_PER_HOUR
const AUTH_MAX_REQUEST_PER_MINUTE = process.env.AUTH_MAX_REQUEST_PER_MINUTE

const maxCount = (isNotEmptyString(MAX_REQUEST_PER_HOUR) && !isNaN(Number(MAX_REQUEST_PER_HOUR)))
  ? parseInt(MAX_REQUEST_PER_HOUR)
  : 0 // 0 means unlimited
const authMaxCount = (isNotEmptyString(AUTH_MAX_REQUEST_PER_MINUTE) && !isNaN(Number(AUTH_MAX_REQUEST_PER_MINUTE)))
  ? parseInt(AUTH_MAX_REQUEST_PER_MINUTE)
  : 0 // 0 means unlimited
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // Maximum number of accesses within an hour
  max: maxCount,
  statusCode: 200, // 200 means success，but the message is 'Too many request from this IP in 1 hour'
  keyGenerator: (req, _) => {
    return requestIp.getClientIp(req) // IP address from requestIp.mw(), as opposed to req.ip
  },
  skipFailedRequests: true,
  message: async (req, res) => {
    res.send({ status: 'Fail', message: '"最近1小时内你已经对话上百次啦，别太辛苦休息一下', data: null })
  },
})
const verificationLimiter = rateLimit({
  windowMs: 60 * 1000, // Maximum number of accesses within an hour
  max: 1,
  statusCode: 200,
  skipFailedRequests: true,
  keyGenerator: (req, _) => {
    return requestIp.getClientIp(req) // IP address from requestIp.mw(), as opposed to req.ip
  },
  message: async (req, res) => {
    res.status(403).send({ status: 'Fail', message: '"抱歉1分钟内只能发送1次验证码', data: null })
  },
})
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // Maximum number of accesses within a minute
  max: authMaxCount,
  statusCode: 200, // 200 means success，but the message is 'Too many request from this IP in 1 minute'
  keyGenerator: (req, _) => {
    return requestIp.getClientIp(req) // IP address from requestIp.mw(), as opposed to req.ip
  },
  message: async (req, res) => {
    res.send({ status: 'Fail', message: '1分钟内失败的授权请求过多，请稍后再试', data: null })
  },
})

export { limiter, authLimiter, verificationLimiter }
