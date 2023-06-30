import type { Response } from 'express'

// Error mapping table
// const errorTable = {
//   ForbiddenError: { statusCode: 403, message: 'Forbidden error occurred' },
//   ServiceUnavailableError: { statusCode: 503, message: 'Service is unavailable' },
//   default: { statusCode: 500, message: 'Internal server error' },
// }

export function handleErrors(res: Response, error: Error) {
  // console.error(error)
  if (error instanceof ForbiddenError)
    res.status(403).send({ status: 'Fail', message: error.message, data: null })
  else if (error instanceof ServiceUnavailableError)
    res.status(503).send({ status: 'Fail', message: error.message, data: null })
  else
    res.status(500).send({ status: 'Fail', message: error.message, data: null })
}

export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServiceUnavailableError'
  }
}
