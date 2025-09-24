import { type RequestHandler, Router } from 'express'

import CaselistController from '../caselist/caselistController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import PniController from '../pni/pniController'
import ReferralDetailsController from '../referralDetails/referralDetailsController'
import RisksAndNeedsController from '../risksAndNeeds/risksAndNeedsController'
import type { Services } from '../services'
import LocationPreferencesController from '../locationPreferences/locationPreferencesController'
import ChangeCohortController from '../cohort/changeCohortController'
import LdcController from '../ldc/ldcController'
import UpdateReferralStatusController from '../updateReferralStatus/updateReferralStatusController'

export default function routes({ accreditedProgrammesManageAndDeliverService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler): Router => router.post(path, asyncMiddleware(handler))

  const caselistController = new CaselistController(accreditedProgrammesManageAndDeliverService)
  const referralDetailsController = new ReferralDetailsController(accreditedProgrammesManageAndDeliverService)
  const risksAndNeedsController = new RisksAndNeedsController(accreditedProgrammesManageAndDeliverService)
  const programmeNeedsIdenfitierController = new PniController(accreditedProgrammesManageAndDeliverService)
  const locationPreferencesController = new LocationPreferencesController(accreditedProgrammesManageAndDeliverService)
  const cohortController = new ChangeCohortController(accreditedProgrammesManageAndDeliverService)
  const ldcController = new LdcController(accreditedProgrammesManageAndDeliverService)
  const updateReferralController = new UpdateReferralStatusController(accreditedProgrammesManageAndDeliverService)

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

  get('/referral/:referralId/add-location-preferences', async (req, res, next) => {
    await locationPreferencesController.showLocationPreferencesPage(req, res)
  })

  post('/referral/:referralId/add-location-preferences', async (req, res, next) => {
    await locationPreferencesController.showLocationPreferencesPage(req, res)
  })

  get('/referral/:referralId/add-location-preferences/additional-pdus', async (req, res, next) => {
    await locationPreferencesController.showAdditionalPduLocationPreferencesPage(req, res)
  })

  post('/referral/:referralId/add-location-preferences/additional-pdus', async (req, res, next) => {
    await locationPreferencesController.showAdditionalPduLocationPreferencesPage(req, res)
  })

  get('/referral/:referralId/add-location-preferences/cannot-attend-locations', async (req, res, next) => {
    await locationPreferencesController.showCannotAttendLocationsPage(req, res)
  })

  post('/referral/:referralId/add-location-preferences/cannot-attend-locations', async (req, res, next) => {
    await locationPreferencesController.showCannotAttendLocationsPage(req, res)
  })

  get('/referral/:referralId/add-location-preferences', async (req, res, next) => {
    await locationPreferencesController.showLocationPreferencesPage(req, res)
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

  get('/referral/:referralId/risks-and-alerts', async (req, res, next) => {
    await risksAndNeedsController.showRisksAndAlertsPage(req, res)
  })

  get('/referral/:referralId/learning-needs', async (req, res, next) => {
    await risksAndNeedsController.showLearningNeedsPage(req, res)
  })

  get('/referral/:referralId/offence-analysis', async (req, res, next) => {
    await risksAndNeedsController.showOffenceAnalysisPage(req, res)
  })

  get('/referral/:referralId/relationships', async (req, res, next) => {
    await risksAndNeedsController.showRelationshipsPage(req, res)
  })

  get('/referral/:referralId/lifestyle-and-associates', async (req, res, next) => {
    await risksAndNeedsController.showLifestyleAndAssociatesPage(req, res)
  })

  get('/referral/:referralId/drug-misuse', async (req, res, next) => {
    await risksAndNeedsController.showDrugDetailsPage(req, res)
  })

  get('/referral/:referralId/alcohol-misuse', async (req, res, next) => {
    await risksAndNeedsController.showAlcoholMisusePage(req, res)
  })

  get('/referral/:referralId/emotional-wellbeing', async (req, res, next) => {
    await risksAndNeedsController.showEmotionalWellbeingPage(req, res)
  })

  get('/referral/:referralId/thinking-and-behaving', async (req, res, next) => {
    await risksAndNeedsController.showThinkingAndBehavingPage(req, res)
  })

  get('/referral/:referralId/attitudes', async (req, res, next) => {
    await risksAndNeedsController.showAttitudesPage(req, res)
  })

  get('/referral/:referralId/health', async (req, res, next) => {
    await risksAndNeedsController.showHealthPage(req, res)
  })

  get('/referral/:referralId/rosh-analysis', async (req, res, next) => {
    await risksAndNeedsController.showRoshAnalysisPage(req, res)
  })

  get('/referral/:referralId/programme-needs-identifier', async (req, res, next) => {
    await programmeNeedsIdenfitierController.showProgrammeNeedsIdentifierPage(req, res)
  })

  get('/referral/:referralId/change-cohort', async (req, res, next) => {
    await cohortController.showChangeCohortPage(req, res)
  })

  post('/referral/:referralId/change-cohort', async (req, res, next) => {
    await cohortController.showChangeCohortPage(req, res)
  })

  get('/referral/:referralId/update-ldc', async (req, res, next) => {
    await ldcController.showChangeLdcPage(req, res)
  })

  post('/referral/:referralId/update-ldc', async (req, res, next) => {
    await ldcController.showChangeLdcPage(req, res)
  })

  get('/referral/:referralId/update-status', async (req, res, next) => {
    await updateReferralController.updateStatus(req, res)
  })

  return router
}
