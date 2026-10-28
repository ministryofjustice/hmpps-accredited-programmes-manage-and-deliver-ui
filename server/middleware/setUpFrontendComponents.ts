import type { RequestHandler } from 'express'
import pdsComponents from '@ministryofjustice/hmpps-probation-frontend-components'
import logger from '../../logger'
import config from '../config'

export default function setUpFrontendComponents(): RequestHandler {
  const middleware = pdsComponents.getPageComponents({
    pdsUrl: config.apis.probationApi.url,
    logger,
  })

  return (req, res, next) => {
    middleware(req, res, error => {
      if (error) return next(error)

      const footer = res.locals.feComponents?.footer
      if (footer) {
        res.locals.feComponents.footer = footer.replace(
          /\/accessibility\/?(?=["'])/g,
          '/accessibility/accredited-programmes',
        )
      }

      return next()
    })
  }
}
