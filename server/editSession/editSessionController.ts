import { RescheduleSessionRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../utils/formValidationError'
import EditSessionDateAndTimeFormForm from './dateAndTime/editSessionDateAndTimeForm'
import EditSessionDateAndTimePresenter from './dateAndTime/editSessionDateAndTimePresenter'
import EditSessionDateAndTimeView from './dateAndTime/editSessionDateAndTimeView'
import OtherSessionsPresenter from './dateAndTime/otherSessionsPresenter'
import OtherSessionsView from './dateAndTime/otherSessionsView'
import RescheduleOtherSessionsForm from './dateAndTime/rescheduleOtherSessionsForm'
import DeleteSessionPresenter from './deleteSession/deleteSessionPresenter'
import DeleteSessionView from './deleteSession/deleteSessionView'
import EditSessionAttendeesPresenter from './editSessionAttendees/editSessionAttendeesPresenter'
import EditSessionAttendeesView from './editSessionAttendees/editSessionAttendeesView'
import EditSessionForm from './editSessionForm'
import EditSessionPresenter from './editSessionPresenter'
import EditSessionView from './editSessionView'
import EditSessionFacilitatorsForm from './facilitators/editSessionFacilitatorsForm'
import EditSessionFacilitatorsPresenter from './facilitators/editSessionFacilitatorsPresenter'
import EditSessionFacilitatorsView from './facilitators/editSessionFacilitatorsView'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'

export default class EditSessionController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  private static hasSessionDateAndTimeChanged(
    sessionDetails: {
      sessionDate: string
      sessionStartTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
      sessionEndTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
    },
    submitted: {
      sessionStartDate: string // DD/MM/YYYY
      sessionStartTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
      sessionEndTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
    },
  ): boolean {
    // Convert submitted DD/MM/YYYY to YYYY-MM-DD for comparison
    const [day, month, year] = submitted.sessionStartDate.split('/')
    const submittedDateIso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

    if (sessionDetails.sessionDate !== submittedDateIso) return true

    const origStart = sessionDetails.sessionStartTime
    const subStart = submitted.sessionStartTime
    if (
      origStart.hour !== subStart.hour ||
      origStart.minutes !== subStart.minutes ||
      origStart.amOrPm !== subStart.amOrPm
    )
      return true

    const origEnd = sessionDetails.sessionEndTime
    const subEnd = submitted.sessionEndTime
    if (origEnd.hour !== subEnd.hour || origEnd.minutes !== subEnd.minutes || origEnd.amOrPm !== subEnd.amOrPm)
      return true

    return false
  }

  private isSessionInPast(sessionDetails: {
    sessionDate: string
    sessionStartTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
  }): boolean {
    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const { sessionDate } = sessionDetails

    let sessionDateParsed: Date | null = null

    const isoMatch = sessionDate.match(/^(\d{4})-(\d{2})-(\d{2})/)
    if (isoMatch) {
      const [, year, month, day] = isoMatch
      sessionDateParsed = new Date(Number(year), Number(month) - 1, Number(day))
    }

    if (!sessionDateParsed) {
      const ukMatch = sessionDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (ukMatch) {
        const [, day, month, year] = ukMatch
        sessionDateParsed = new Date(Number(year), Number(month) - 1, Number(day))
      }
    }

    if (!sessionDateParsed) {
      const fallback = new Date(sessionDate)
      if (Number.isNaN(fallback.getTime())) {
        return false
      }
      fallback.setHours(0, 0, 0, 0)
      sessionDateParsed = fallback
    }

    if (sessionDateParsed < today) {
      return true
    }

    if (sessionDateParsed.getTime() !== today.getTime()) {
      return false
    }

    // Session is today — check if the start time has already passed
    const startHour24 =
      sessionDetails.sessionStartTime.amOrPm === 'AM'
        ? sessionDetails.sessionStartTime.hour % 12
        : (sessionDetails.sessionStartTime.hour % 12) + 12

    const sessionStartDateTime = new Date(sessionDateParsed)
    sessionStartDateTime.setHours(startHour24, sessionDetails.sessionStartTime.minutes, 0, 0)

    return sessionStartDateTime < now
  }

  async editSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    const { message, isAttendanceHistory, referralId } = req.query
    let formError: FormValidationError | null = null

    req.session.editSessionDateAndTime = {}

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionDetails(
      username,
      groupId,
      sessionId,
    )

    // Only show the message if it is present
    let successMessage: string | null = null
    if (message) {
      successMessage = String(message)
    }
    const isAttendanceHistoryFlag = isAttendanceHistory === 'true'
    const attendanceHistoryReferralId = referralId ? String(referralId) : null
    req.session.originPage = req.path

    const data = await new EditSessionForm(req).attendanceAndSessionNotesData()
    if (req.method === 'POST') {
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.editSessionAttendance = {
          referralIds: data.paramsForUpdate.referralIds,
          source: 'edit-session',
        }
        return res.redirect(`/group/${groupId}/session/${sessionId}/record-attendance`)
      }
    }

    const presenter = new EditSessionPresenter(
      groupId,
      sessionDetails,
      sessionId,
      `/group/${groupId}/session/${sessionId}/delete-session`,
      successMessage,
      isAttendanceHistoryFlag,
      formError,
      attendanceHistoryReferralId,
    )
    const view = new EditSessionView(presenter)

    return this.renderPage(res, view)
  }

  async deleteSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new EditSessionForm(req).deleteData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate?.delete === 'yes') {
        const response = await this.accreditedProgrammesManageAndDeliverService.deleteSession(username, sessionId)
        return res.redirect(`/group/${groupId}/sessions-and-attendance?successMessage=${response}`)
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionDetails(username, sessionId)

    const presenter = new DeleteSessionPresenter(groupId, req.session.originPage, sessionDetails, formError)
    const view = new DeleteSessionView(presenter)

    return this.renderPage(res, view)
  }

  async editSessionAttendees(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user

    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new EditSessionForm(req).attendeesData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        const message = await this.accreditedProgrammesManageAndDeliverService.updateSessionAttendees(
          username,
          sessionId,
          data.paramsForUpdate.referralId,
        )
        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session?message=${message}`)
      }
    }

    const sessionAttendees = await this.accreditedProgrammesManageAndDeliverService.getSessionAttendees(
      username,
      sessionId,
    )
    const backUrl = `/group/${groupId}/session/${sessionId}/edit-session`
    const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, sessionAttendees, formError)
    const view = new EditSessionAttendeesView(presenter)

    return this.renderPage(res, view)
  }

  async editSessionDateAndTime(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime(
      username,
      sessionId,
    )
    const sessionAttendees = await this.accreditedProgrammesManageAndDeliverService.getSessionAttendees(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const isSessionInPast = this.isSessionInPast(sessionDetails)

      const data = await new EditSessionDateAndTimeFormForm(
        req,
        isSessionInPast,
        sessionDetails.sessionStartTime,
        sessionDetails.sessionEndTime,
      ).rescheduleSessionDetailsData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const { sessionStartDate, sessionStartTime, sessionEndTime } = data.paramsForUpdate
        const hasChanged = EditSessionController.hasSessionDateAndTimeChanged(sessionDetails, {
          sessionStartDate,
          sessionStartTime,
          sessionEndTime,
        })

        if (!hasChanged) {
          return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session`)
        }

        req.session.editSessionDateAndTime = {
          sessionStartDate: data.paramsForUpdate.sessionStartDate,
          sessionStartTime: data.paramsForUpdate.sessionStartTime,
          sessionEndTime: data.paramsForUpdate.sessionEndTime,
        }

        // GROUP sessions and ONE_TO_ONE catch-ups go to the reschedule page
        if (sessionAttendees.sessionType === 'GROUP' && !sessionAttendees.isCatchup) {
          return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session-date-and-time/reschedule`)
        }

        // For ONE_TO_ONE sessions, submit directly to API
        const [day, month, year] = data.paramsForUpdate.sessionStartDate.split('/')
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

        const rescheduleRequest: RescheduleSessionRequest = {
          sessionStartDate: formattedDate,
          sessionStartTime: data.paramsForUpdate.sessionStartTime,
          sessionEndTime: data.paramsForUpdate.sessionEndTime,
          rescheduleOtherSessions: false,
        }

        const response = await this.accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime(
          username,
          sessionId,
          rescheduleRequest,
        )

        delete req.session.editSessionDateAndTime
        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session?message=${response.message}`)
      }
    }
    const presenter = new EditSessionDateAndTimePresenter(
      groupId,
      sessionDetails,
      sessionAttendees.sessionType,
      req.session.editSessionDateAndTime,
      formError,
      userInputData,
    )
    const view = new EditSessionDateAndTimeView(presenter)

    return this.renderPage(res, view)
  }

  async submitEditSessionDateAndTime(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getRescheduleSessionDetails(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const data = await new RescheduleOtherSessionsForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.editSessionDateAndTime.rescheduleOtherSessions = data.paramsForUpdate.rescheduleOtherSessions
        req.session.editSessionDateAndTime.sessionStartDate = (() => {
          const [day, month, year] = req.session.editSessionDateAndTime.sessionStartDate.split('/')
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        })()
        const message = await this.accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime(
          username,
          sessionDetails.sessionId,
          req.session.editSessionDateAndTime as RescheduleSessionRequest,
        )
        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session?message=${message.message}`)
      }
    }

    const presenter = new OtherSessionsPresenter(groupId, sessionDetails, req.session.editSessionDateAndTime, formError)
    const view = new OtherSessionsView(presenter)

    return this.renderPage(res, view)
  }

  async editSessionFacilitators(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    const editSessionFacilitators = await this.accreditedProgrammesManageAndDeliverService.getEditSessionFacilitators(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const data = await new EditSessionFacilitatorsForm(req).editSessionFacilitatorsData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.sessionFacilitators = data.paramsForUpdate
        const message = await this.accreditedProgrammesManageAndDeliverService.updateSessionFacilitators(
          username,
          sessionId,
          req.session.sessionFacilitators,
        )
        return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session?message=${message}`)
      }
    }
    const presenter = new EditSessionFacilitatorsPresenter(
      req.session.originPage,
      groupId,
      editSessionFacilitators,
      formError,
      userInputData,
    )
    const view = new EditSessionFacilitatorsView(presenter)

    return this.renderPage(res, view)
  }
}
