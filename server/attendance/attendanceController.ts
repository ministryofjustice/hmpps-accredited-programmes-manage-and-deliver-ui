import { Request, Response } from 'express'
import { RecordSessionAttendance, SessionAttendance } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import AttendancePresenter from './attendancePresenter'
import AttendanceView from './attendanceView'
import RecordAttendanceForm from './recordAttendanceForm'
import { FormValidationError } from '../utils/formValidationError'
import AttendanceSessionNotesPresenter from './attendanceNotes/attendanceSessionNotesPresenter'
import AttendanceSessionNotesView from './attendanceNotes/attendanceSessionNotesView'
import { convertToUrlFriendlyKebabCase } from '../utils/utils'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'
import errorMessages from '../utils/errorMessages'

export default class AttendanceController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showRecordAttendancePage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, sessionId } = req.params
    const referralIds = this.referralIds(req)

    if (!referralIds.length) {
      return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session`)
    }

    const sessionAttendees = (req.session.editSessionAttendance?.attendees || []) as SessionAttendance['attendees']
    let userInputData = null
    let formError: FormValidationError | null = null

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
      referralIds,
    )

    const recordAttendanceDataWithSessionSelections: RecordSessionAttendance = {
      ...recordAttendanceBffData,
      people: recordAttendanceBffData.people.map(person => {
        const stagedAttendee = sessionAttendees.find(attendee => attendee.referralId === person.referralId)

        if (!stagedAttendee?.outcomeCode) {
          return person
        }

        return {
          ...person,
          sessionNotes: stagedAttendee.sessionNotes ?? person.sessionNotes,
          attendance: {
            ...person.attendance,
            code: stagedAttendee.outcomeCode,
          },
        }
      }),
    }

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
        req.session.editSessionAttendance.attendees = data.paramsForUpdate.attendees.map(attendee => {
          const existingPerson = recordAttendanceDataWithSessionSelections.people.find(
            person => person.referralId === attendee.referralId,
          )

          return {
            ...attendee,
            sessionNotes: existingPerson?.sessionNotes ?? attendee.sessionNotes,
          }
        })
        const sessionTitle = convertToUrlFriendlyKebabCase(recordAttendanceBffData.sessionTitle)
        return res.redirect(this.notesPageUri(groupId, sessionId, referralIds[0], sessionTitle))
      }
    }

    const backLinkUri = `/group/${groupId}/session/${sessionId}/edit-session`

    const presenter = new AttendancePresenter(
      recordAttendanceDataWithSessionSelections,
      backLinkUri,
      formError,
      userInputData,
    )
    const view = new AttendanceView(presenter)

    return this.renderPage(res, view)
  }

  async showRecordAttendanceNotesPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { groupId, sessionId, referralId, groupTitle } = req.params

    const referralIds = this.referralIds(req)
    const attendees = (req.session.editSessionAttendance?.attendees || []) as SessionAttendance['attendees']

    if (!referralIds.length) {
      return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session`)
    }

    const recordAttendanceBffData = await this.accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData(
      username,
      sessionId,
      referralIds,
    )

    const theGroupTitle = convertToUrlFriendlyKebabCase(recordAttendanceBffData.sessionTitle)

    if (!groupTitle && req.method === 'GET') {
      return res.redirect(this.notesPageUri(groupId, sessionId, referralId, theGroupTitle))
    }

    const currentReferralIndex = referralIds.findIndex(id => id === referralId)

    if (currentReferralIndex === -1) {
      return res.redirect(`/group/${groupId}/session/${sessionId}/edit-session`)
    }

    const isLastReferral = currentReferralIndex === referralIds.length - 1
    const currentAttendee = attendees.find(attendee => attendee.referralId === referralId)
    const referralPerson = recordAttendanceBffData.people.find(person => person.referralId === referralId)
    const selectedAttendanceCode = currentAttendee?.outcomeCode

    const backLinkUri =
      currentReferralIndex > 0
        ? this.notesPageUri(groupId, sessionId, referralIds[currentReferralIndex - 1], theGroupTitle)
        : `/group/${groupId}/session/${sessionId}/record-attendance`

    if (req.method === 'POST') {
      const isSkipAndAddLater = req.body.action === 'skip-and-add-later'
      const submittedNotes = (req.body['record-session-attendance-notes'] as string | undefined) || ''

      if (currentAttendee && !isSkipAndAddLater) {
        const validationError = this.validateSessionNotes(submittedNotes)

        if (validationError) {
          res.status(400)
          const presenter = new AttendanceSessionNotesPresenter(
            validationError,
            recordAttendanceBffData,
            groupId,
            sessionId,
            selectedAttendanceCode,
            isLastReferral,
            referralId,
            submittedNotes,
            backLinkUri,
          )
          const view = new AttendanceSessionNotesView(presenter)
          return this.renderPage(res, view)
        }

        currentAttendee.sessionNotes = submittedNotes
      }

      if (isLastReferral) {
        const createSessionAttendanceResponse =
          await this.accreditedProgrammesManageAndDeliverService.createSessionAttendance(username, sessionId, {
            attendees: this.normaliseAttendeesForSubmission(attendees),
          })

        const attendeeReferralIds = createSessionAttendanceResponse.attendees.map(attendee => attendee.referralId)
        const successMessage = this.attendanceSuccessMessage(
          recordAttendanceBffData,
          attendeeReferralIds.length ? attendeeReferralIds : referralIds,
        )

        delete req.session.editSessionAttendance
        return res.redirect(
          `/group/${groupId}/session/${sessionId}/edit-session?message=${encodeURIComponent(successMessage)}`,
        )
      }

      return res.redirect(this.notesPageUri(groupId, sessionId, referralIds[currentReferralIndex + 1], theGroupTitle))
    }

    const notesValue = this.resolveNotesValue(currentAttendee?.sessionNotes, referralPerson?.sessionNotes)

    const presenter = new AttendanceSessionNotesPresenter(
      null,
      recordAttendanceBffData,
      groupId,
      sessionId,
      selectedAttendanceCode,
      isLastReferral,
      referralId,
      notesValue,
      backLinkUri,
    )
    const view = new AttendanceSessionNotesView(presenter)

    return this.renderPage(res, view)
  }

  private referralIds(req: Request): string[] {
    const rawReferralIds = req.session.editSessionAttendance?.referralIds as unknown

    if (Array.isArray(rawReferralIds)) {
      return rawReferralIds
    }

    if (typeof rawReferralIds === 'string' && rawReferralIds.length > 0) {
      return [rawReferralIds]
    }

    return []
  }

  private normaliseAttendeesForSubmission(attendees: SessionAttendance['attendees']): SessionAttendance['attendees'] {
    return attendees.map(attendee => {
      const { sessionNotes, ...attendeeWithoutNotes } = attendee

      if (typeof sessionNotes === 'undefined') {
        return attendeeWithoutNotes
      }

      return {
        ...attendeeWithoutNotes,
        sessionNotes: sessionNotes.trim(),
      }
    })
  }

  private attendanceSuccessMessage(recordAttendanceBffData: RecordSessionAttendance, referralIds: string[]): string {
    const names = referralIds
      .map(id => recordAttendanceBffData.people.find(person => person.referralId === id)?.name)
      .filter((name): name is string => Boolean(name))

    const formattedNames = this.formatNames(names)
    return `Attendance recorded for ${formattedNames}.`
  }

  private formatNames(names: string[]): string {
    if (!names.length) {
      return 'person(s)'
    }

    if (names.length === 1) {
      return names[0]
    }

    if (names.length === 2) {
      return `${names[0]} and ${names[1]}`
    }

    return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`
  }

  private notesPageUri(groupId: string, sessionId: string, referralId: string, groupTitle: string): string {
    return `/group/${groupId}/session/${sessionId}/referral/${referralId}/${groupTitle}-session-notes`
  }

  private resolveNotesValue(attendeeNotes?: string, bffNotes?: string): string {
    return attendeeNotes ?? bffNotes ?? ''
  }

  private validateSessionNotes(notes: string): FormValidationError | null {
    if (notes.length <= 10000) {
      return null
    }

    return {
      errors: [
        {
          formFields: ['record-session-attendance-notes'],
          errorSummaryLinkedField: 'record-session-attendance-notes',
          message: errorMessages.recordAttendance.sessionNotesTooLong,
        },
      ],
    }
  }
}
