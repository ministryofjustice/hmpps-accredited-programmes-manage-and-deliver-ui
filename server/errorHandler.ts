import type { Request, Response, NextFunction } from 'express'
import type { HTTPError } from 'superagent'
import logger from '../logger'
import { buildPrimaryNavigationArgs } from './shared/routes/primaryNavigation'

type ErrorPageContent = {
  heading: string
  subheading?: string
  body: string
}

const errorPageContentByStatus: Record<number, ErrorPageContent> = {
  403: {
    heading: 'You cannot access this referral',
    subheading: '<span class="moj-badge moj-badge--red">RESTRICTED ACCESS</span>',
    body: '<p>Access to this person’s record is restricted in NDelius. Speak to your Programme Manager for more information.</p>',
  },
  404: {
    heading: 'Page not found',
    body: '<p>If you typed the web address, check it is correct.</p><p>If you pasted the web address, check you copied the entire address.</p>',
  },
  500: {
    heading: 'Sorry, there is a problem with the service',
    body: '<p>Try reloading the page. To do this, press F5 (on a PC), or Cmd + R (on a Mac).</p><p>If the page still does not load, try again later.</p><p>You can report a problem with the service through the <a href="https://mojprod.service-now.com/moj_sp?id=emp_taxonomy_topic&topic_id=75608d7847d099106322862c736d43ac">Tech Portal.</a></p>',
  },
  503: {
    heading: 'Sorry, the service is unavailable',
    body: '',
    // body: 'You’ll be able to use the service from [HH:MMam/pm] on [DAY DD Month].',
  },
}

const fallbackErrorPageContent: ErrorPageContent = {
  heading: 'Sorry, there is a problem with the service',
  body: 'Try again later.',
}

const hideDebugDetailsForStatuses = new Set([400, 403, 404, 500, 503])
const hideNavigationForStatuses = new Set([503])

export default function createErrorHandler(production: boolean) {
  return (error: HTTPError, req: Request, res: Response, next: NextFunction): void => {
    logger.error(`Error handling request for '${req.originalUrl}', user '${res.locals.user?.username}'`, error)

    if (error.status === 401) {
      logger.info('Logging user out')
      return res.redirect('/sign-out')
    }

    const status = error.status || 500
    const pageContent = errorPageContentByStatus[status] || fallbackErrorPageContent
    const showDebugDetails = !production && !hideDebugDetailsForStatuses.has(status)

    res.locals.pageTitle = pageContent.heading
    res.locals.heading = pageContent.heading
    res.locals.subheading = pageContent.subheading
    res.locals.body = pageContent.body
    res.locals.primaryNavigationArgs = hideNavigationForStatuses.has(status)
      ? null
      : buildPrimaryNavigationArgs(res.locals.userRegion?.regionDescription ?? '')
    res.locals.message = showDebugDetails ? error.message : null
    res.locals.status = status
    res.locals.stack = showDebugDetails ? error.stack : null

    res.status(status)

    return res.render('pages/error')
  }
}
