import type { RequestHandler } from 'express'
import config from '../config'

export default function sentryMiddleware(): RequestHandler {
  // Pass-through Sentry config into locals, for use in the Sentry loader script (see layout.njk)
  return (req, res, next) => {
    res.locals.sentry = config.sentry
    return next()
  }
}
