import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import { UserRole } from '../types/UserRole'
import { Status } from '../types/Status'
import { getUserById } from '../storage/mongo'
import { getCacheConfig } from '../service/configService'

dotenv.config()

const rootAuth = async (req, res, next) => {
  const config = await getCacheConfig()
  if (config.siteConfig.loginEnabled) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const info = jwt.verify(token, config.siteConfig.loginSalt.trim())
      req.headers.userId = info.userId
      const user = await getUserById(info.userId)
      if (user == null || user.status !== Status.Normal || !user.roles.includes(UserRole.Admin))
        res.send({ status: 'Fail', message: '无权限 | No permission.', data: null })
      else
        next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    res.send({ status: 'Fail', message: '无权限 | No permission.', data: null })
  }
}

export { rootAuth }
