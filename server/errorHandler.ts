import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError & { statusCode?: number }, req: Request, res: Response, _next: NextFunction): void => {
    const status = (error.status ?? error.statusCode ?? 500) as number

    // Only log non-404 errors
    if (status !== 404) {
      logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)
    }

    if (status === 401 || status === 403) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    res.locals.message = production
      ? 'Something went wrong. The error has been logged. Please try again'
      : error.message
    res.locals.status = status
    res.locals.stack = production ? null : error.stack

    res.status(status || 500)
    return res.render('pages/error')
  }
}
