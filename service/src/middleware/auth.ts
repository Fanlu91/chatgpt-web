import jwt from 'jsonwebtoken'
import type { Request, Response } from 'express'
import { getUserById } from 'src/repository/UserRepository'
import { getCacheConfig } from '../service/configService'
import { Status } from '../types/Status'

const auth = async (req: Request, res: Response, next: () => void) => {
  const config = await getCacheConfig()
  if (config.siteConfig.loginEnabled) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const info = jwt.verify(token, config.siteConfig.loginSalt.trim())
      req.headers.userId = info.userId
      const user = await getUserById(info.userId)
      if (user == null || user.status !== Status.Normal)
        throw new Error('用户不存在 | User does not exist.')
      else
        next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    // fake userid
    req.headers.userId = '6406d8c50aedd633885fa16f'
    next()
  }
}

async function getUserId(req: Request): Promise<string | undefined> {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const config = await getCacheConfig()
    const info = jwt.verify(token, config.siteConfig.loginSalt.trim())
    return info.userId
  }
  catch (error) {

  }
  return null
}

export { auth, getUserId }
