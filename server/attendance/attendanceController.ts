import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import AttendancePresenter from './attendancePresenter'
import AttendanceView from './attendanceView'
import RecordAttendanceForm from './recordAttendanceForm'
import { FormValidationError } from '../utils/formValidationError'
import AttendanceSessionNotesPresenter from './attendanceNotes/attendanceSessionNotesPresenter'
import AttendanceSessionNotesView from './attendanceNotes/attendanceSessionNotesView'

export default class AttendanceController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showRecordAttendancePage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, sessionId } = req.params
    let userInputData = null
    let formError: FormValidationError | null = null

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
      req.session.editSessionAttendance.referralIds,
    )

    const data = await new RecordAttendanceForm(
      req,
      recordAttendanceBffData.people.map(it => ({ referralId: it.referralId, name: it.name })),
    ).recordAttendanceData()

    if (req.method === 'POST') {
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.editSessionAttendance.attendees = data.paramsForUpdate.attendees
        // Use the first attendee's referralId from the form submission
        const firstReferralId = data.paramsForUpdate.attendees[0]?.referralId
        if (firstReferralId) {
          const groupTitle = this.toUrlSlug(recordAttendanceBffData.sessionTitle)
          req.session.save(err => {
            if (err) {
              throw err
            }
            res.redirect(`/group/${groupId}/session/${sessionId}/referral/${firstReferralId}/${groupTitle}-notes`)
          })
          return
        }
      }
    }

    const backLinkUri = `/group/${groupId}/session/${sessionId}/edit-session`

    const presenter = new AttendancePresenter(recordAttendanceBffData, backLinkUri, formError, userInputData)
    const view = new AttendanceView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showRecordAttendanceNotesPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, sessionId, referralId } = req.params
    const formError: FormValidationError | null = null

    const redirectToRecordAttendance = () => res.redirect(`/group/${groupId}/session/${sessionId}/record-attendance`)

    const sessionAttendance = req.session.editSessionAttendance
    if (
      !sessionAttendance?.referralIds ||
      !sessionAttendance?.attendees ||
      !sessionAttendance.referralIds.includes(referralId)
    ) {
      return redirectToRecordAttendance()
    }

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
      sessionAttendance.referralIds,
    )

    const person = recordAttendanceBffData.people.find(p => p.referralId === referralId)
    const attendee = sessionAttendance.attendees.find(a => a.referralId === referralId)

    if (!person || !attendee) {
      return redirectToRecordAttendance()
    }

    const selectedOptionText = person.options?.find(opt => opt.value === attendee.outcomeCode)?.text || ''

    if (req.method === 'POST') {
      const notes = String(req.body['record-session-attendance-notes'] ?? '')
      ;(attendee as typeof attendee & { sessionNotes?: string }).sessionNotes = notes

      const currentIndex = sessionAttendance.referralIds.indexOf(referralId)
      const isLastReferral = currentIndex === sessionAttendance.referralIds.length - 1

      if (isLastReferral) {
        await this.accreditedProgrammesManageAndDeliverService.postSessionAttendance(username, sessionId, {
          attendees: sessionAttendance.attendees.map(a => ({
            referralId: a.referralId,
            outcomeCode: a.outcomeCode,
            sessionNotes: (a as typeof a & { sessionNotes?: string }).sessionNotes ?? '',
          })),
          responseMessage: '',
        })
        return res.redirect(`/group/${groupId}/session/${sessionId}`)
      }

      const nextReferralId = sessionAttendance.referralIds[currentIndex + 1]
      const groupTitle = this.toUrlSlug(recordAttendanceBffData.sessionTitle)
      return res.redirect(`/group/${groupId}/session/${sessionId}/referral/${nextReferralId}/${groupTitle}-notes`)
    }

    const presenter = new AttendanceSessionNotesPresenter(
      formError,
      recordAttendanceBffData,
      groupId,
      sessionId,
      person,
      selectedOptionText,
    )
    const view = new AttendanceSessionNotesView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null)
  }

  private toUrlSlug(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}
