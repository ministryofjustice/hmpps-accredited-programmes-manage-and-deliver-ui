import { type RequestHandler, Router } from 'express'

import CaselistController from '../caselist/caselistController'
import ChangeCohortController from '../cohort/changeCohortController'
import CreateGroupController from '../groupCreate/groupCreateController'
import EditSessionController from '../sessionEdit/sessionEditController'
import GroupController from '../groupList/groupListController'
import GroupAllocationNotesController from '../groupAllocationNotes/groupAllocationNotesController'
import AddToGroupController from '../groupOverview/addToGroup/addToGroupController'
import GroupOverviewController from '../groupOverview/groupOverviewController'
import RemoveFromGroupController from '../groupOverview/removeFromGroup/removeFromGroupController'
import LdcController from '../ldc/ldcController'
import LocationPreferencesController from '../locationPreferences/locationPreferencesController'
import asyncMiddleware from '../middleware/asyncMiddleware'
import PniController from '../pni/pniController'
import ReferralDetailsController from '../referralDetails/referralDetailsController'
import RisksAndNeedsController from '../risksAndNeeds/risksAndNeedsController'
import type { Services } from '../services'
import SessionScheduleController from '../sessionSchedule/sessionScheduleController'
import UpdateReferralStatusController from '../updateReferralStatus/updateReferralStatusController'

export default function routes({ accreditedProgrammesManageAndDeliverService }: Services): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string, handler: RequestHandler): Router => router.post(path, asyncMiddleware(handler))
  // Since most of our methods we want to be able to GET and POST from the same URL this helper function enables both.
  // This should be the standard going forward
  const getOrPost = (path: string, handler: RequestHandler) =>
    router.route(path).get(asyncMiddleware(handler)).post(asyncMiddleware(handler))

  const caselistController = new CaselistController(accreditedProgrammesManageAndDeliverService)
  const referralDetailsController = new ReferralDetailsController(accreditedProgrammesManageAndDeliverService)
  const risksAndNeedsController = new RisksAndNeedsController(accreditedProgrammesManageAndDeliverService)
  const programmeNeedsIdenfitierController = new PniController(accreditedProgrammesManageAndDeliverService)
  const locationPreferencesController = new LocationPreferencesController(accreditedProgrammesManageAndDeliverService)
  const cohortController = new ChangeCohortController(accreditedProgrammesManageAndDeliverService)
  const ldcController = new LdcController(accreditedProgrammesManageAndDeliverService)
  const updateReferralController = new UpdateReferralStatusController(accreditedProgrammesManageAndDeliverService)
  const groupOverviewController = new GroupOverviewController(accreditedProgrammesManageAndDeliverService)
  const addToGroupController = new AddToGroupController(accreditedProgrammesManageAndDeliverService)
  const removeFromGroupController = new RemoveFromGroupController(accreditedProgrammesManageAndDeliverService)
  const groupAllocationNotesController = new GroupAllocationNotesController(accreditedProgrammesManageAndDeliverService)
  const createGroupController = new CreateGroupController(accreditedProgrammesManageAndDeliverService)
  const groupController = new GroupController(accreditedProgrammesManageAndDeliverService)
  const sessionScheduleController = new SessionScheduleController(accreditedProgrammesManageAndDeliverService)
  const editSessionController = new EditSessionController(accreditedProgrammesManageAndDeliverService)

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

  get('/referral/:referralId/status-history', async (req, res, next) => {
    await referralDetailsController.showStatusHistoryPage(req, res)
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

  post('/referral/:referralId/update-status', async (req, res, next) => {
    await updateReferralController.updateStatus(req, res)
  })

  getOrPost('/referral/:referralId/update-status-scheduled', async (req, res, next) => {
    await updateReferralController.updateStatusStartedOrCompleted(req, res)
  })

  getOrPost('/referral/:referralId/update-status-on-programme', async (req, res, next) => {
    await updateReferralController.updateStatusStartedOrCompleted(req, res)
  })

  getOrPost('/referral/:referralId/update-status-details', async (req, res, next) => {
    await updateReferralController.updateStatusToOnProgrammeOrCompleted(req, res)
  })

  getOrPost('/group/create-a-group/create-group', async (req, res) => {
    await createGroupController.showCreateGroupStart(req, res)
  })

  getOrPost('/group/create-a-group/create-group-code', async (req, res) => {
    await createGroupController.showCreateGroupCode(req, res)
  })
  getOrPost('/group/create-a-group/group-cohort', async (req, res) => {
    await createGroupController.showCreateGroupCohort(req, res)
  })
  getOrPost('/group/create-a-group/group-start-date', async (req, res) => {
    await createGroupController.showCreateGroupDate(req, res)
  })
  getOrPost('/group/create-a-group/group-days-and-times', async (req, res) => {
    await createGroupController.showCreateGroupWhen(req, res)
  })

  getOrPost('/group/create-a-group/group-sex', async (req, res) => {
    await createGroupController.showCreateGroupSex(req, res)
  })

  getOrPost('/group/create-a-group/group-probation-delivery-unit', async (req, res) => {
    await createGroupController.showCreateGroupPdu(req, res)
  })

  getOrPost('/group/create-a-group/group-delivery-location', async (req, res) => {
    await createGroupController.showCreateGroupLocation(req, res)
  })

  getOrPost('/group/create-a-group/group-facilitators', async (req, res) => {
    await createGroupController.showCreateGroupTreatmentManager(req, res)
  })

  getOrPost('/group/create-a-group/group-review-details', async (req, res) => {
    await createGroupController.showCreateGroupCya(req, res)
  })

  get('/groupOverview/:groupId/allocated', async (req, res) => {
    await groupOverviewController.showGroupOverviewAllocated(req, res)
  })

  post('/groupOverview/:groupId/allocated', async (req, res) => {
    await groupOverviewController.showGroupOverviewAllocated(req, res)
  })

  get('/groupOverview/:groupId/waitlist', async (req, res, next) => {
    await groupOverviewController.showGroupOverviewWaitlist(req, res)
  })

  post('/groupOverview/:groupId/waitlist', async (req, res, next) => {
    await groupOverviewController.showGroupOverviewWaitlist(req, res)
  })

  get('/group/:groupId/schedule-overview', async (req, res, next) => {
    await groupOverviewController.showScheduleOverview(req, res)
  })

  get(
    '/referral/:referralId/group-allocation-notes/motivation-background-and-non-associations',
    async (req, res, next) => {
      await groupAllocationNotesController.showMotivationBackgroundAndNonAssociationsPage(req, res)
    },
  )

  getOrPost('/referral/:referralId/add-motivation-background-and-non-associations', async (req, res, next) => {
    await groupAllocationNotesController.showAddMotivationBackgroundAndNonAssociationsNotesPage(req, res)
  })

  get('/addToGroup/:groupId/:referralId', async (req, res, next) => {
    await addToGroupController.addToGroup(req, res)
  })

  post('/addToGroup/:groupId/:referralId', async (req, res, next) => {
    await addToGroupController.addToGroup(req, res)
  })

  get('/addToGroup/:groupId/:referralId/moreDetails', async (req, res, next) => {
    await addToGroupController.addToGroupMoreDetails(req, res)
  })

  post('/addToGroup/:groupId/:referralId/moreDetails', async (req, res, next) => {
    await addToGroupController.addToGroupMoreDetails(req, res)
  })

  get('/removeFromGroup/:groupId/:referralId', async (req, res, next) => {
    await removeFromGroupController.removeFromGroup(req, res)
  })

  post('/removeFromGroup/:groupId/:referralId', async (req, res, next) => {
    await removeFromGroupController.removeFromGroup(req, res)
  })

  getOrPost('/removeFromGroup/:groupId/:referralId/updateStatus', async (req, res, next) => {
    await removeFromGroupController.removeFromGroupUpdateStatus(req, res)
  })

  get('/groups/not-started', async (req, res, next) => {
    await groupController.showNotStartedGroupListPage(req, res)
  })

  get('/groups/started', async (req, res, next) => {
    await groupController.showStartedGroupListPage(req, res)
  })

  getOrPost('/group/:groupId/module/:moduleId/schedule-session-type', async (req, res) => {
    await sessionScheduleController.showSessionSchedule(req, res)
  })

  getOrPost('/group/:groupId/module/:moduleId/schedule-group-session-details', async (req, res, next) => {
    await sessionScheduleController.scheduleGroupSessionDetails(req, res)
  })

  getOrPost('/group/:groupId/module/:moduleId/session-review-details', async (req, res, next) => {
    await sessionScheduleController.scheduleGroupSessionCya(req, res)
  })

  get('/group/:groupId/sessions-and-attendance', async (req, res) => {
    await sessionScheduleController.showSessionAttendance(req, res)
  })

  getOrPost('/group/:groupId/sessionId/:sessionId/edit-session', async (req, res, next) => {
    await editSessionController.editSession(req, res)
  })

  getOrPost('/group/:groupId/session/:sessionId/edit-session-date-and-time', async (req, res, next) => {
    await editSessionController.editSessionDateAndTime(req, res)
  })

  getOrPost('/group/:groupId/session/:sessionId/edit-session-date-and-time/reschedule', async (req, res, next) => {
    await editSessionController.submitEditSessionDateAndTime(req, res)
  })
  getOrPost('/group/:groupId/sessionId/:sessionId/delete-session', async (req, res, next) => {
    await editSessionController.deleteSession(req, res)
  })

  getOrPost('/group/:groupId/session/:sessionId/edit-session-facilitators', async (req, res, next) => {
    await editSessionController.editSessionFacilitators(req, res)
  })

  return router
}
