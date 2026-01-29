import { SessionScheduleGroupResponse } from '@manage-and-deliver-api'
import { AccordionArgsItem } from '../../utils/govukFrontendTypes'
// import GroupServiceNavigationPresenter from '../../shared/groups/groupServiceNavigationPresenter'
import { MojAlertComponentArgs } from '../../interfaces/alertComponentArgs'
import GroupServiceLayoutPresenter, {
  GroupServiceNavigationValues,
} from '../../shared/groups/groupServiceLayoutPresenter'

type SessionModule = NonNullable<SessionScheduleGroupResponse['modules']>[number]
type ModuleSession = NonNullable<SessionModule['sessions']>[number]

export default class SessionScheduleAttendancePresenter extends GroupServiceLayoutPresenter {
  constructor(
    readonly groupId: string,
    private readonly groupSessionsData: SessionScheduleGroupResponse | null = null,
    private readonly successMessage?: string,
  ) {
    super(GroupServiceNavigationValues.sessionsAndAttendanceTab, groupId)
  }

  get text() {
    const groupCode = this.groupSessionsData?.group?.code

    return {
      headingCaptionText: groupCode || '',
      headingText: 'Sessions and attendance',
    }
  }

  get scheduleSessionSuccessMessageArgs(): MojAlertComponentArgs | null {
    if (!this.successMessage) return null

    return {
      variant: 'success',
      title: 'Success',
      text: this.successMessage,
      dismissible: true,
    }
  }

  getAccordionItems(): AccordionArgsItem[] {
    const modules = this.modulesSessions()

    if (!modules.length) {
      return [
        {
          heading: { text: 'No modules available' },
          content: {
            html: '<p class="govuk-body">There are no module details available for this group yet.</p>',
          },
          expanded: true,
        },
      ]
    }

    return modules.map(moduleSession => ({
      heading: { text: this.moduleHeading(moduleSession) },

      content: { html: this.moduleContent(moduleSession) },
      expanded: false,
    }))
  }

  private modulesSessions(): SessionModule[] {
    const modulesSessions = this.groupSessionsData?.modules
    return Array.isArray(modulesSessions) ? (modulesSessions as SessionModule[]) : []
  }

  private moduleHeading(moduleSession: SessionModule) {
    return `${moduleSession.name ?? ''}`.trim()
  }

  private moduleContent(moduleSession: SessionModule) {
    const sessions = Array.isArray(moduleSession.sessions) ? moduleSession.sessions : []

    const sessionsHtml = `
      <table class="govuk-table" data-module="moj-sortable-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">Session name</th>
            <th scope="col" class="govuk-table__header">Session type</th>
            <th scope="col" class="govuk-table__header">Participants</th>
            <th scope="col" class="govuk-table__header" aria-sort="none" data-sortable>Date of session</th>
            <th scope="col" class="govuk-table__header">Time</th>
            <th scope="col" class="govuk-table__header">Facilitators</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          ${sessions.map((session: ModuleSession) => this.sessionTableRow(session)).join('')}
        </tbody>
      </table>
    `

    const startDateTextHtml = this.getStartDateText(moduleSession)
    const scheduleButtonText = moduleSession.scheduleButtonText || 'Schedule a session'
    const scheduleButtonHref = this.scheduleSessionHref(moduleSession)

    const scheduleButtonHtml = `
    ${startDateTextHtml}
    <div class="govuk-!-margin-top-4">
      <a class="govuk-button govuk-button--secondary" data-module="govuk-button" href="${scheduleButtonHref}">
        ${scheduleButtonText}
      </a>
    </div>
  `

    return `${sessionsHtml}${scheduleButtonHtml}`
  }

  private getStartDateText(moduleSession: SessionModule): string {
    if (moduleSession.startDateText?.estimatedStartDateText && moduleSession.startDateText?.sessionStartDate) {
      return `<p class="govuk-body"><strong>${moduleSession.startDateText.estimatedStartDateText}:</strong> ${moduleSession.startDateText.sessionStartDate}</p>`
    }

    return ''
  }

  private sessionTableRow(session: ModuleSession): string {
    const participants = session.participants?.length ? session.participants.join('<br/> ') : ''
    const facilitators = session.facilitators?.length
      ? session.facilitators.join('<span class="govuk-!-display-block govuk-!-margin-bottom-1"></span>')
      : ''
    const dateSortValue = this.sortableTableDate(session.dateOfSession)

    return `
    <tr class="govuk-table__row">
      <td class="govuk-table__cell"><a href="/group/${this.groupId}/sessionId/${session.id}/${session.name}">${session.name || ''}</a></td>
      <td class="govuk-table__cell">${session.type || ''}</td>
      <td class="govuk-table__cell">${participants}</td>
      <td class="govuk-table__cell" data-sort-value="${dateSortValue}">${session.dateOfSession || ''}</td>
      <td class="govuk-table__cell">${session.timeOfSession || ''}</td>
      <td class="govuk-table__cell">${facilitators}</td>
    </tr>
  `
  }

  private sortableTableDate(dateString: string | undefined): string {
    if (!dateString) return ''
    const date = new Date(dateString)
    return Number.isNaN(date.getTime()) ? dateString : date.getTime().toString()
  }

  private scheduleSessionHref(moduleSession: SessionModule) {
    return `/group/${this.groupId}/module/${moduleSession.id}/schedule-session-type`
  }
}
