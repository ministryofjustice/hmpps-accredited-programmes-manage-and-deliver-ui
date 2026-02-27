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
    let userInputData = this.sessionAttendanceToFormData(req.session.editSessionAttendance)
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
        const existingAttendees = req.session.editSessionAttendance.attendees ?? []
        req.session.editSessionAttendance.attendees = data.paramsForUpdate.attendees.map(attendee => {
          const existing = existingAttendees.find(item => item.referralId === attendee.referralId)
          if (existing && 'sessionNotes' in existing) {
            return { ...attendee, sessionNotes: (existing as typeof existing & { sessionNotes?: string }).sessionNotes }
          }
          return attendee
        })
        // Use the first attendee's referralId from the form submission
        const firstReferralId = data.paramsForUpdate.attendees[0]?.referralId
        if (firstReferralId) {
          const groupTitle = this.toUrlSlug(recordAttendanceBffData.sessionTitle)
          const redirectUri = `/group/${groupId}/session/${sessionId}/referral/${firstReferralId}/${groupTitle}-session-notes`
          if (typeof req.session.save === 'function') {
            req.session.save(err => {
              if (err) {
                throw err
              }
              res.redirect(redirectUri)
            })
          } else {
            res.redirect(redirectUri)
          }
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
    const referralIds = this.referralIdsAsArray(sessionAttendance?.referralIds)
    if (!referralIds.length || !sessionAttendance?.attendees || !referralIds.includes(referralId)) {
      return redirectToRecordAttendance()
    }

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
      referralIds,
    )

    const person = recordAttendanceBffData.people.find(p => p.referralId === referralId)
    const attendee = sessionAttendance.attendees.find(a => a.referralId === referralId)

    if (!person || !attendee) {
      return redirectToRecordAttendance()
    }

    const selectedOptionText = person.options?.find(opt => opt.value === attendee.outcomeCode)?.text || ''
    const sessionNotes = (attendee as typeof attendee & { sessionNotes?: string }).sessionNotes ?? ''

    const currentIndex = referralIds.indexOf(referralId)
    const isFirstReferral = currentIndex === 0
    const groupTitle = this.toUrlSlug(recordAttendanceBffData.sessionTitle)

    const backLinkUri = isFirstReferral
      ? `/group/${groupId}/session/${sessionId}/record-attendance`
      : `/group/${groupId}/session/${sessionId}/referral/${referralIds[currentIndex - 1]}/${groupTitle}-session-notes`

    if (req.method === 'POST') {
      const action = String(req.body['attendance-notes-action'] ?? 'continue')
      const isLastReferral = currentIndex === referralIds.length - 1

      if (action !== 'skip' || isLastReferral) {
        const notes = String(req.body['record-session-attendance-notes'] ?? '')
        ;(attendee as typeof attendee & { sessionNotes?: string }).sessionNotes = notes
      }

      if (isLastReferral) {
        const payload = {
          attendees: sessionAttendance.attendees.map(a => ({
            referralId: a.referralId,
            outcomeCode: a.outcomeCode,
            ...((a as typeof a & { sessionNotes?: string }).sessionNotes?.trim()
              ? { sessionNotes: (a as typeof a & { sessionNotes?: string }).sessionNotes?.trim() }
              : {}),
          })),
        }

        try {
          await this.accreditedProgrammesManageAndDeliverService.postSessionAttendance(username, sessionId, payload)
        } catch (error) {
          if (this.isLeadFacilitatorMissingError(error)) {
            return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session`)
          }

          throw error
        }
        return res.redirect(
          `/group/${groupId}/session/${sessionId}/edit-session?message=${encodeURIComponent('Attendance and session notes updated')}`,
        )
      }

      const nextReferralId = referralIds[currentIndex + 1]
      return res.redirect(
        `/group/${groupId}/session/${sessionId}/referral/${nextReferralId}/${groupTitle}-session-notes`,
      )
    }

    const presenter = new AttendanceSessionNotesPresenter(
      formError,
      recordAttendanceBffData,
      groupId,
      sessionId,
      person,
      selectedOptionText,
      sessionNotes,
      currentIndex === referralIds.length - 1,
      backLinkUri,
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

  private sessionAttendanceToFormData(sessionAttendance?: {
    attendees?: { referralId: string; outcomeCode: string }[]
  }): Record<string, string> | null {
    if (!sessionAttendance?.attendees?.length) {
      return null
    }

    return sessionAttendance.attendees.reduce<Record<string, string>>((acc, attendee) => {
      acc[`attendance-${attendee.referralId}`] = attendee.outcomeCode
      return acc
    }, {})
  }

  private isLeadFacilitatorMissingError(error: unknown): boolean {
    const status = (error as { status?: number })?.status
    const rawData = (error as { data?: unknown })?.data

    if (status !== 400 || !rawData) {
      return false
    }

    const body = Buffer.isBuffer(rawData) ? rawData.toString('utf8') : String(rawData)

    try {
      const parsed = JSON.parse(body) as { userMessage?: string; developerMessage?: string }
      const message = `${parsed.userMessage ?? ''} ${parsed.developerMessage ?? ''}`.toLowerCase()
      return message.includes('lead facilitator not found')
    } catch {
      return body.toLowerCase().includes('lead facilitator not found')
    }
  }

  private referralIdsAsArray(referralIds: unknown): string[] {
    if (Array.isArray(referralIds)) {
      return referralIds.filter((value): value is string => typeof value === 'string')
    }

    return typeof referralIds === 'string' ? [referralIds] : []
  }
}
