import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import type { Services } from '../services'
import ReferralDetailsController from '../referralDetails/referralDetailsController'
import CaselistController from '../caselist/caselistController'
import ProgrammeNeedsIdentifierController from '../programmeNeedsIdentifier/programmeNeedsIdentifierController'

export default function routes({ accreditedProgrammesManageAndDeliverService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler): Router => router.post(path, asyncMiddleware(handler))

  const caselistController = new CaselistController(accreditedProgrammesManageAndDeliverService)
  const referralDetailsController = new ReferralDetailsController(accreditedProgrammesManageAndDeliverService)
  const programmeNeedsIdenfitierController = new ProgrammeNeedsIdentifierController(
    accreditedProgrammesManageAndDeliverService,
  )

  get('/', async (req, res, next) => {
    await caselistController.showOpenCaselist(req, res)
  })

  get('/pdu/open-referrals', async (req, res, next) => {
    await caselistController.showOpenCaselist(req, res)
  })

  get('/pdu/closed-referrals', async (req, res, next) => {
    await caselistController.showClosedCaselist(req, res)
  })

  get('/referral-details/:id/personal-details', async (req, res, next) => {
    await referralDetailsController.showPersonalDetailsPage(req, res)
  })

  get('/referral-details/:id/programme-history', async (req, res, next) => {
    await referralDetailsController.showProgrammeHistoryPage(req, res)
  })

  get('/referral-details/:id/offence-history', async (req, res, next) => {
    await referralDetailsController.showOffenceHistoryPage(req, res)
  })

  get('/referral-details/:id/sentence-information', async (req, res, next) => {
    await referralDetailsController.showSentenceInformationPage(req, res)
  })

  get('/referral-details/:id/availability', async (req, res, next) => {
    await referralDetailsController.showAvailabilityPage(req, res)
  })

  get('/referral-details/:id/location', async (req, res, next) => {
    await referralDetailsController.showLocationPage(req, res)
  })

  get('/referral-details/:id/additional-information', async (req, res, next) => {
    await referralDetailsController.showAdditionalInformationPage(req, res)
  })

  get('/referral/:referralId/add-availability', async (req, res, next) => {
    await referralDetailsController.showAddAvailabilityPage(req, res)
  })

  post('/referral/:referralId/add-availability', async (req, res, next) => {
    await referralDetailsController.showAddAvailabilityPage(req, res)
  })

  get('/referral/:referralId/update-availability/:availabilityId', async (req, res, next) => {
    await referralDetailsController.updateAvailability(req, res)
  })

  post('/referral/:referralId/update-availability/:availabilityId', async (req, res, next) => {
    await referralDetailsController.updateAvailability(req, res)
  })

  get('/referral/:referralId/programme-needs-identifier', async (req, res, next) => {
    await programmeNeedsIdenfitierController.showProgrammeNeedsIdentifierPage(req, res)
  })

  return router
}
