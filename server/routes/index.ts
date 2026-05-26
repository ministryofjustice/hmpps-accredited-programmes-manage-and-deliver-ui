import { type RequestHandler, Router } from 'express'

import CaselistController from '../caselist/caselistController'
import ChangeCohortController from '../cohort/changeCohortController'
import CreateGroupController from '../createGroup/createGroupController'
import EditSessionController from '../editSession/editSessionController'
import GroupController from '../group/groupController'
import GroupDetailsController from '../groupDetails/groupDetailsController'
import AvailabilityAndMotivationController from '../availabilityAndMotivation/availabilityAndMotivationController'
import AddToGroupController from '../groupOverview/addToGroup/addToGroupController'
import GroupOverviewController from '../groupOverview/groupOverviewController'
import RemoveFromGroupController from '../groupOverview/removeFromGroup/removeFromGroupController'
import LdcController from '../ldc/ldcController'
import LocationPreferencesController from '../availabilityAndMotivation/locationPreferences/locationPreferencesController'
import authorisationMiddleware from '../middleware/authorisationMiddleware'
import asyncMiddleware from '../middleware/asyncMiddleware'
import PniController from '../pni/pniController'
import ReferralDetailsController from '../referralDetails/referralDetailsController'
import ReportingController from '../reporting/reportingController'
import RisksAndNeedsController from '../risksAndNeeds/risksAndNeedsController'
import type { Services } from '../services'
import SessionScheduleController from '../sessionSchedule/sessionScheduleController'
import UpdateReferralStatusController from '../updateReferralStatus/updateReferralStatusController'
import AttendanceController from '../attendance/attendanceController'
import HomeController from '../home/homeController'
import SessionNotesController from '../sessionNotes/sessionNotesController'
import AddAvailabilityController from '../availabilityAndMotivation/addAvailability/addAvailabilityController'
import EditGroupController from '../createGroup/editGroupController'

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
  const availabilityAndMotivationController = new AvailabilityAndMotivationController(
    accreditedProgrammesManageAndDeliverService,
  )
  const createGroupController = new CreateGroupController(accreditedProgrammesManageAndDeliverService)
  const groupController = new GroupController(accreditedProgrammesManageAndDeliverService)
  const groupDetailsController = new GroupDetailsController(accreditedProgrammesManageAndDeliverService)
  const sessionScheduleController = new SessionScheduleController(accreditedProgrammesManageAndDeliverService)
  const editSessionController = new EditSessionController(accreditedProgrammesManageAndDeliverService)
  const attendanceController = new AttendanceController(accreditedProgrammesManageAndDeliverService)
  const sessionNotesController = new SessionNotesController(accreditedProgrammesManageAndDeliverService)
  const homeController = new HomeController()
  const addAvailabilityController = new AddAvailabilityController(accreditedProgrammesManageAndDeliverService)
  const editGroupController = new EditGroupController(accreditedProgrammesManageAndDeliverService)
  const reportingController = new ReportingController(accreditedProgrammesManageAndDeliverService)

  const reportingRole = 'ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING'

  get('/', async (req, res, next) => {
    await homeController.showHomePage(req, res)
  })

  get('/region/open-referrals', async (req, res, next) => {
    await caselistController.showOpenCaselist(req, res)
  })

  get('/region/closed-referrals', async (req, res, next) => {
    await caselistController.showClosedCaselist(req, res)
  })

  router.get(
    '/reporting/group-size.csv',
    /**
     * @INFO - At time of writing the user REFER_MONITOR_PP
     * does not have the reporting role.  i (wilson) will open a
     * PR on the hmpps-auth repo to create and assign that role.  until
     * then, if you want to test this endpoint, you will need to comment out
     * the call to `authorisationMiddleware` and re-start the server.
     * the ROLE_PROBATION is granted through the (wiremocked) nDelius
     * integration, but the reporting role needs to be assigned separately
     * through hmpps-auth.
     * --TJWC 2026-05-19
     * */
    authorisationMiddleware([reportingRole]),
    asyncMiddleware(async (req, res) => {
      await reportingController.downloadGroupSizeReport(req, res)
    }),
  )

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

  get('/referral/:id/availability-and-motivation/availability', async (req, res, next) => {
    await availabilityAndMotivationController.showAvailabilityPage(req, res)
  })

  get('/referral/:id/availability-and-motivation/location', async (req, res, next) => {
    await availabilityAndMotivationController.showLocationPage(req, res)
  })

  get('/referral/:referralId/add-location-preferences', async (req, res, next) => {
    await locationPreferencesController.showLocationPreferencesPage(req, res)
  })

  post('/referral/:referralId/add-location-preferences', async (req, res, next) => {
    await locationPreferencesController.showLocationPreferencesPage(req, res)
  })

  get('/referral/:referralId/add-location-preferences/other-pdu', async (req, res, next) => {
    await locationPreferencesController.showAdditionalPduLocationPreferencesPage(req, res)
  })

  post('/referral/:referralId/add-location-preferences/other-pdu', async (req, res, next) => {
    await locationPreferencesController.showAdditionalPduLocationPreferencesPage(req, res)
  })

  get('/referral/:referralId/add-locations-cannot-attend', async (req, res, next) => {
    await locationPreferencesController.showCannotAttendLocationsPage(req, res)
  })

  post('/referral/:referralId/add-locations-cannot-attend', async (req, res, next) => {
    await locationPreferencesController.showCannotAttendLocationsPage(req, res)
  })

  get('/referral/:referralId/add-location-preferences', async (req, res, next) => {
    await locationPreferencesController.showLocationPreferencesPage(req, res)
  })

  get('/referral-details/:id/additional-information', async (req, res, next) => {
    await referralDetailsController.showAdditionalInformationPage(req, res)
  })

  getOrPost('/referral/:referralId/add-availability', async (req, res, next) => {
    await addAvailabilityController.showAddAvailabilityPage(req, res)
  })

  getOrPost('/referral/:referralId/update-availability/:availabilityId', async (req, res, next) => {
    await addAvailabilityController.updateAvailability(req, res)
  })

  get('/referral/:referralId/risks-and-needs/risks-and-alerts', async (req, res, next) => {
    await risksAndNeedsController.showRisksAndAlertsPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/learning-needs/', async (req, res, next) => {
    await risksAndNeedsController.showLearningNeedsPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-2-offence-analysis', async (req, res, next) => {
    await risksAndNeedsController.showOffenceAnalysisPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-6-relationships', async (req, res, next) => {
    await risksAndNeedsController.showRelationshipsPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-7-lifestyle-and-associates', async (req, res, next) => {
    await risksAndNeedsController.showLifestyleAndAssociatesPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-8-drug-misuse', async (req, res, next) => {
    await risksAndNeedsController.showDrugDetailsPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-9-alcohol-misuse', async (req, res, next) => {
    await risksAndNeedsController.showAlcoholMisusePage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-10-emotional-wellbeing', async (req, res, next) => {
    await risksAndNeedsController.showEmotionalWellbeingPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-11-thinking-and-behaving', async (req, res, next) => {
    await risksAndNeedsController.showThinkingAndBehavingPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-12-attitudes', async (req, res, next) => {
    await risksAndNeedsController.showAttitudesPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-13-health', async (req, res, next) => {
    await risksAndNeedsController.showHealthPage(req, res)
  })

  get('/referral/:referralId/risks-and-needs/section-r6-rosh-analysis', async (req, res, next) => {
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

  get('/referral/:referralId/update-learning-disabilities-and-challenges', async (req, res, next) => {
    await ldcController.showChangeLdcPage(req, res)
  })

  post('/referral/:referralId/update-learning-disabilities-and-challenges', async (req, res, next) => {
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

  getOrPost('/create-group', async (req, res) => {
    await createGroupController.showCreateGroupStart(req, res)
  })

  getOrPost('/create-group-code', async (req, res) => {
    await createGroupController.showCreateGroupCode(req, res)
  })
  getOrPost('/:groupId/edit-group-code', async (req, res) => {
    await editGroupController.editGroupCode(req, res)
  })
  getOrPost('/group-cohort', async (req, res) => {
    await createGroupController.showCreateOrEditGroupCohort(req, res)
  })
  getOrPost('/:groupId/edit-group-cohort', async (req, res) => {
    await editGroupController.editGroupCohort(req, res)
  })
  getOrPost('/:groupId/edit-group-gender', async (req, res) => {
    await editGroupController.editGroupSex(req, res)
  })
  getOrPost('/group-start-date', async (req, res) => {
    await createGroupController.showCreateGroupDate(req, res)
  })
  getOrPost('/:groupId/edit-group-start-date', async (req, res) => {
    await editGroupController.editGroupDate(req, res)
  })

  getOrPost('/:groupId/edit-start-date-rescheduled', async (req, res) => {
    await editGroupController.editGroupRescheduleDate(req, res)
  })

  getOrPost('/group-days-and-times', async (req, res) => {
    await createGroupController.showCreateGroupWhen(req, res)
  })

  getOrPost('/:groupId/edit-group-days-and-times', async (req, res) => {
    await editGroupController.editGroupDaysAndTimes(req, res)
  })

  getOrPost('/:groupId/edit-session-date-and-time/reschedule', async (req, res) => {
    await editGroupController.editGroupRescheduleDayTimes(req, res)
  })

  getOrPost('/group-gender', async (req, res) => {
    await createGroupController.showCreateOrEditGroupGender(req, res)
  })

  getOrPost('/group-probation-delivery-unit', async (req, res) => {
    await createGroupController.showCreateGroupPdu(req, res)
  })

  getOrPost('/:groupId/edit-group-probation-delivery-unit', async (req, res) => {
    await editGroupController.editGroupPdu(req, res)
  })

  getOrPost('/group-delivery-location', async (req, res) => {
    await createGroupController.showCreateGroupLocation(req, res)
  })

  getOrPost('/:groupId/edit-group-delivery-location', async (req, res) => {
    await editGroupController.editGroupLocation(req, res)
  })

  getOrPost('/group-facilitators', async (req, res) => {
    await createGroupController.showCreateGroupTreatmentManager(req, res)
  })
  getOrPost('/:groupId/edit-group-facilitators', async (req, res) => {
    await editGroupController.editGroupTreatmentManager(req, res)
  })

  getOrPost('/group-review-details', async (req, res) => {
    await createGroupController.showCreateGroupCya(req, res)
  })

  get('/group/:groupId/allocations', async (req, res) => {
    await groupOverviewController.showGroupOverviewAllocated(req, res)
  })

  post('/group/:groupId/allocations', async (req, res) => {
    await groupOverviewController.showGroupOverviewAllocated(req, res)
  })

  get('/group/:groupId/waitlist', async (req, res, next) => {
    await groupOverviewController.showGroupOverviewWaitlist(req, res)
  })

  post('/group/:groupId/waitlist', async (req, res, next) => {
    await groupOverviewController.showGroupOverviewWaitlist(req, res)
  })

  get('/group/:groupId/group-details', async (req, res, next) => {
    await groupDetailsController.showGroupDetailsPage(req, res)
  })

  get('/group/:groupId/schedule-overview', async (req, res, next) => {
    await groupOverviewController.showGroupOverviewSchedule(req, res)
  })

  get(
    '/referral/:referralId/availability-and-motivation/motivation-background-and-non-associations',
    async (req, res, next) => {
      await availabilityAndMotivationController.showMotivationBackgroundAndNonAssociationsPage(req, res)
    },
  )

  getOrPost('/referral/:referralId/add-motivation-background-and-non-associations', async (req, res, next) => {
    await availabilityAndMotivationController.showAddMotivationBackgroundAndNonAssociationsNotesPage(req, res)
  })

  get('/add-to-group/:groupId/:referralId', async (req, res, next) => {
    await addToGroupController.addToGroup(req, res)
  })

  post('/add-to-group/:groupId/:referralId', async (req, res, next) => {
    await addToGroupController.addToGroup(req, res)
  })

  get('/:groupId/:referralId/scheduled-status-details', async (req, res, next) => {
    await addToGroupController.addToGroupMoreDetails(req, res)
  })

  post('/:groupId/:referralId/scheduled-status-details', async (req, res, next) => {
    await addToGroupController.addToGroupMoreDetails(req, res)
  })

  get('/remove-from-group/:groupId/:referralId', async (req, res, next) => {
    await removeFromGroupController.removeFromGroup(req, res)
  })

  post('/remove-from-group/:groupId/:referralId', async (req, res, next) => {
    await removeFromGroupController.removeFromGroup(req, res)
  })

  getOrPost('/remove-from-group/:groupId/:referralId/update-status', async (req, res, next) => {
    await removeFromGroupController.removeFromGroupUpdateStatus(req, res)
  })

  get('/groups/not-started-and-in-progress', async (req, res, next) => {
    await groupController.showNotStartedGroupListPage(req, res)
  })

  get('/groups/completed', async (req, res, next) => {
    await groupController.showCompletedGroupListPage(req, res)
  })

  getOrPost('/:groupId/:moduleId/schedule-session-type', async (req, res) => {
    await sessionScheduleController.showSessionSchedule(req, res)
  })

  getOrPost('/:groupId/:moduleId/schedule-session-details', async (req, res, next) => {
    await sessionScheduleController.scheduleGroupSessionDetails(req, res)
  })

  getOrPost('/:groupId/:moduleId/session-review-details', async (req, res, next) => {
    await sessionScheduleController.scheduleGroupSessionCya(req, res)
  })

  get('/group/:groupId/sessions-and-attendance', async (req, res) => {
    await sessionScheduleController.showSessionAttendance(req, res)
  })

  getOrPost('/:groupId/:sessionId/edit-session', async (req, res, next) => {
    await editSessionController.editSession(req, res)
  })

  getOrPost('/:groupId/:sessionId/edit-session-date-and-time', async (req, res, next) => {
    await editSessionController.editSessionDateAndTime(req, res)
  })

  getOrPost('/:groupId/:sessionId/edit-session-date-and-time/reschedule', async (req, res, next) => {
    await editSessionController.submitEditSessionDateAndTime(req, res)
  })
  getOrPost('/:groupId/:sessionId/delete-session', async (req, res, next) => {
    await editSessionController.deleteSession(req, res)
  })

  getOrPost('/:groupId/:sessionId/edit-session-facilitators', async (req, res, next) => {
    await editSessionController.editSessionFacilitators(req, res)
  })
  getOrPost('/:groupId/:sessionId/edit-session-attendees', async (req, res, next) => {
    await editSessionController.editSessionAttendees(req, res)
  })

  getOrPost('/:groupId/:sessionId/record-attendance', async (req, res, next) => {
    await attendanceController.showRecordAttendancePage(req, res)
  })
  getOrPost('/:groupId/:sessionId/:sessionSlug-attendance', async (req, res, next) => {
    await attendanceController.showRecordAttendancePage(req, res)
  })
  getOrPost('/:groupId/:sessionId/referral/:referralId', async (req, res, next) => {
    await attendanceController.showRecordAttendanceNotesPage(req, res)
  })
  getOrPost('/:groupId/:sessionId/referral/:referralId/:groupTitle-session-notes', async (req, res, next) => {
    await attendanceController.showRecordAttendanceNotesPage(req, res)
  })

  get('/referral/:referralId/attendance-history', async (req, res, next) => {
    await referralDetailsController.showAttendanceHistoryPage(req, res)
  })

  getOrPost('/:groupId/:sessionId/:sessionSlug-attendance-and-session-notes', async (req, res, next) => {
    await sessionNotesController.showSessionNotesPage(req, res)
  })

  getOrPost('/:groupId/:sessionId/:sessionSlug', async (req, res, next) => {
    await editSessionController.editSession(req, res)
  })

  return router
}
