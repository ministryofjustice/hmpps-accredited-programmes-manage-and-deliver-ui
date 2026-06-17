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
import { convertToUrlFriendlyKebabCase, getEditSessionRouteTitle } from '../utils/utils'
import DateUtils from '../utils/dateUtils'
import DateFormatUtils from '../utils/dateFormatUtils'
import errorMessages from '../utils/errorMessages'

export default class EditSessionController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  private static readonly durationLongerThanOriginallyScheduledErrorMessage =
    errorMessages.sessionSchedule.sessionDetailsDurationLongerThanOriginallyScheduled

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  /**
   * Convert a date string to YYYY-MM-DD (date-only format).
   * Accepts ISO with or without time, or UK format (DD/MM/YYYY).
   */
  private static toDateOnlyString(dateStr: string): string | null {
    return DateFormatUtils.toDateOnlyISO(dateStr)
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
    const sessionDateForComparison = EditSessionController.toDateOnlyString(sessionDetails.sessionDate)
    const submittedDateForComparison = EditSessionController.toDateOnlyString(submitted.sessionStartDate)
    if (sessionDateForComparison !== submittedDateForComparison) return true

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

  private isSessionEnded(sessionDetails: {
    sessionDate: string
    sessionEndTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
  }): boolean {
    return DateFormatUtils.isSessionEnded(
      sessionDetails.sessionDate,
      sessionDetails.sessionEndTime.hour,
      sessionDetails.sessionEndTime.minutes,
      sessionDetails.sessionEndTime.amOrPm,
    )
  }

  private static toDurationValidationError(error: unknown): FormValidationError | null {
    const status = typeof error === 'object' && error !== null ? (error as { status?: number }).status : undefined
    const data =
      typeof error === 'object' && error !== null
        ? (error as { data?: { userMessage?: unknown; developerMessage?: unknown } }).data
        : undefined

    if (status !== 400 || !data) {
      return null
    }

    const messageUsers = [data.userMessage, data.developerMessage]
    const matchedMessage = messageUsers.find(
      user => typeof user === 'string' && user.toLowerCase().includes('cannot be longer than originally scheduled'),
    )

    if (!matchedMessage) {
      return null
    }

    return {
      errors: [
        {
          errorSummaryLinkedField: 'session-details-end-time-hour',
          formFields: ['session-details-end-time-hour'],
          message: EditSessionController.durationLongerThanOriginallyScheduledErrorMessage,
        },
      ],
    }
  }

  private static durationInMinutes(time: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }): number {
    const convertedTime = DateUtils.convertTo24Hour(time.hour, time.minutes, time.amOrPm)
    return convertedTime.hour * 60 + convertedTime.minute
  }

  private static isSubmittedDurationShorterThanCurrent(
    sessionDetails: {
      sessionStartTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
      sessionEndTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
    },
    submitted: {
      sessionStartTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
      sessionEndTime: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' }
    },
  ): boolean {
    const currentDuration =
      EditSessionController.durationInMinutes(sessionDetails.sessionEndTime) -
      EditSessionController.durationInMinutes(sessionDetails.sessionStartTime)
    const submittedDuration =
      EditSessionController.durationInMinutes(submitted.sessionEndTime) -
      EditSessionController.durationInMinutes(submitted.sessionStartTime)

    return submittedDuration < currentDuration
  }

  async editSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params as Record<string, string>
    const { username } = req.user
    const { message, isAttendanceHistory, referralId, editSessionMessage } = req.query
    let formError: FormValidationError | null = null

    req.session.editSessionDateAndTime = {}

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupSessionDetails(
      username,
      groupId,
      sessionId,
    )

    const successMessage = message ? String(message) : null
    const editSessionSuccessMessage = editSessionMessage ? String(editSessionMessage) : null
    const isAttendanceHistoryFlag = isAttendanceHistory === 'true'
    const attendanceHistoryReferralId = referralId ? String(referralId) : null
    const moduleName = convertToUrlFriendlyKebabCase(
      getEditSessionRouteTitle(sessionDetails.pageTitle, sessionDetails.sessionType),
    )
    const attendanceSlug =
      sessionDetails.isCatchup && !moduleName.endsWith('-catch-up') ? `${moduleName}-catch-up` : moduleName
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
        return res.redirect(`/${groupId}/${sessionId}/${attendanceSlug}-attendance`)
      }
    }

    const presenter = new EditSessionPresenter(
      groupId,
      sessionDetails,
      sessionId,
      `/${groupId}/${sessionId}/delete-session`,
      successMessage,
      editSessionSuccessMessage,
      isAttendanceHistoryFlag,
      formError,
      attendanceHistoryReferralId,
    )
    const view = new EditSessionView(presenter)

    return this.renderPage(res, view)
  }

  async deleteSession(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params as Record<string, string>
    const { username } = req.user

    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new EditSessionForm(req).deleteData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate?.delete === 'yes') {
        const response = await this.accreditedProgrammesManageAndDeliverService.deleteSession(username, sessionId)
        return res.redirect(`/group/${groupId}/sessions-and-attendance?editSessionMessage=${response}`)
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
    const { groupId, sessionId } = req.params as Record<string, string>
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
        return res.redirect(`/${groupId}/${sessionId}/edit-session?editSessionMessage=${message}`)
      }
    }

    const sessionAttendees = await this.accreditedProgrammesManageAndDeliverService.getSessionAttendees(
      username,
      sessionId,
    )
    const backUrl = `/${groupId}/${sessionId}/edit-session`
    const presenter = new EditSessionAttendeesPresenter(groupId, backUrl, sessionAttendees, formError)
    const view = new EditSessionAttendeesView(presenter)

    return this.renderPage(res, view)
  }

  async editSessionDateAndTime(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params as Record<string, string>
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    const sessionDetails = await this.accreditedProgrammesManageAndDeliverService.getSessionEditDateAndTime(
      username,
      sessionId,
    )
    const isSessionEnded = this.isSessionEnded(sessionDetails)
    const sessionAttendees = await this.accreditedProgrammesManageAndDeliverService.getSessionAttendees(
      username,
      sessionId,
    )

    if (req.method === 'POST') {
      const data = await new EditSessionDateAndTimeFormForm(
        req,
        isSessionEnded,
        sessionDetails.sessionStartTime,
        sessionDetails.sessionEndTime,
      ).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const { sessionStartDate, sessionStartTime, sessionEndTime } = data.paramsForUpdate
        const isSubmittedDateInPast = DateFormatUtils.isDateInPast(sessionStartDate)
        const hasChanged = EditSessionController.hasSessionDateAndTimeChanged(sessionDetails, {
          sessionStartDate,
          sessionStartTime,
          sessionEndTime,
        })

        if (!hasChanged) {
          return res.redirect(`/${groupId}/${sessionId}/edit-session`)
        }
        req.session.editSessionDateAndTime = {
          sessionStartDate: data.paramsForUpdate.sessionStartDate,
          sessionStartTime: data.paramsForUpdate.sessionStartTime,
          sessionEndTime: data.paramsForUpdate.sessionEndTime,
        }

        // GROUP sessions that have not yet ended go to the reschedule page.
        // Ended sessions and sessions moved to a past date submit directly so users are not asked to reschedule later sessions.
        if (
          sessionAttendees.sessionType === 'GROUP' &&
          !sessionAttendees.isCatchup &&
          !isSessionEnded &&
          !isSubmittedDateInPast
        ) {
          return res.redirect(`/${groupId}/${sessionId}/edit-group-days-and-times/reschedule`)
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

        let response: { message: string } | null
        try {
          response = await this.accreditedProgrammesManageAndDeliverService.updateSessionDateAndTime(
            username,
            sessionId,
            rescheduleRequest,
          )
        } catch (error) {
          const durationValidationError = EditSessionController.toDurationValidationError(error)
          if (!durationValidationError) {
            throw error
          }

          if (
            EditSessionController.isSubmittedDurationShorterThanCurrent(sessionDetails, {
              sessionStartTime: rescheduleRequest.sessionStartTime,
              sessionEndTime: rescheduleRequest.sessionEndTime,
            })
          ) {
            durationValidationError.errors[0].message = `${durationValidationError.errors[0].message} You have shortened this session, but it is still longer than the originally scheduled duration.`
          }

          res.status(400)
          formError = durationValidationError
          userInputData = req.body
          response = null
        }

        if (!response) {
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

        delete req.session.editSessionDateAndTime

        return res.redirect(`/${groupId}/${sessionId}/edit-session?editSessionMessage=${response.message}`)
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
    const { groupId, sessionId } = req.params as Record<string, string>
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

        return res.redirect(`/${groupId}/${sessionId}/edit-session?editSessionMessage=${message.message}`)
      }
    }

    const presenter = new OtherSessionsPresenter(groupId, sessionDetails, req.session.editSessionDateAndTime, formError)
    const view = new OtherSessionsView(presenter)

    return this.renderPage(res, view)
  }

  async editSessionFacilitators(req: Request, res: Response): Promise<void> {
    const { groupId, sessionId } = req.params as Record<string, string>
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
        return res.redirect(`/${groupId}/${sessionId}/edit-session?editSessionMessage=${message}`)
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
