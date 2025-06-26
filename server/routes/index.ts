import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import { Page } from '../services/auditService'
import TestPageController from '../testPage/testPageController'
import PersonalDetailsController from '../personalDetails/personalDetailsController'

export default function routes({ auditService, accreditedProgrammesManageAndDeliverService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  const testPageController = new TestPageController(accreditedProgrammesManageAndDeliverService)
  const personalDetailsController = new PersonalDetailsController(accreditedProgrammesManageAndDeliverService)

  get('/', async (req, res, next) => {
    await auditService.logPageView(Page.EXAMPLE_PAGE, { who: res.locals.user.username, correlationId: req.id })

    return res.render('pages/index')
  })

  get('/test', async (req, res, next) => {
    await testPageController.showTestPage(req, res)
  })

  get('/personalDetails/:id', async (req, res, next) => {
    await personalDetailsController.showPersonalDetailsPage(req, res)
  })

  return router
}
