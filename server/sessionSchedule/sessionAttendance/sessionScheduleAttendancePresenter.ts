import { SessionScheduleRequest, GroupSessionsResponse } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import GroupServiceNavigationPresenter from '../../shared/groups/groupServiceNavigationPresenter'

type SessionType = 'getting-started' | 'one-to-one'

export default class SessionScheduleAttendancePresenter {
  public readonly navigationPresenter: GroupServiceNavigationPresenter

  constructor(
    private readonly groupId: string,
    private readonly sessionTypeValue: SessionType,
    private readonly validationError: FormValidationError | null = null,
    private readonly sessionScheduleFormData: Partial<
      SessionScheduleRequest & { sessionScheduleGettingStarted?: string; sessionScheduleOnetoOne?: string }
    > | null = null,
    private readonly groupSessionsData: GroupSessionsResponse | null = null,
  ) {
    this.navigationPresenter = new GroupServiceNavigationPresenter(groupId, undefined, 'sessions')
  }

  get backLinkUri() {
    return `/group/${this.groupId}/sessions`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get fields() {
    const fieldName =
      this.sessionTypeValue === 'getting-started' ? 'sessionScheduleGettingStarted' : 'sessionScheduleOnetoOne'
    const errorFieldName = this.sessionTypeValue === 'getting-started' ? 'session-getting-started' : 'session-onetoone'

    return {
      [fieldName]: {
        value: this.sessionScheduleFormData?.[fieldName],
        errorMessage: PresenterUtils.errorMessage(this.validationError, errorFieldName),
      },
    }
  }

  get sessionType() {
    return this.sessionTypeValue
  }

  get groupInfo() {
    return this.groupSessionsData?.group || { code: '', regionName: '' }
  }

  get modules() {
    return this.groupSessionsData?.modules || []
  }

  getAccordionItems() {
    return this.modules.map((module, index) => ({
      heading: {
        text: module.name,
      },
      content: {
        html: this.getModuleSessionsHtml(module),
      },
      expanded: index === 0,
    }))
  }

  private getModuleSessionsHtml(module: (typeof this.modules)[0]): string {
    const sessions = Array.isArray(module.sessions) ? module.sessions : []

    if (!sessions.length) {
      return `
        <p class="govuk-body">No sessions scheduled</p>
          ${this.getEstimatedDateHtml(module)}
        ${this.getScheduleSessionButtonHtml(module)}
      `
    }

    const rows = sessions
      .map(session => {
        const sessionDate = session.dateOfSession || session.sessionDate || '-'
        const sessionTime = session.timeOfSession || session.time || '-'
        const sessionType = session.type || session.sessionType || session.session_type || '-'
        const participants = session.participants || '-'
        const facilitators = session.facilitators || '-'

        return `
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">${session.name || '-'}</td>
            <td class="govuk-table__cell">${sessionType}</td>
            <td class="govuk-table__cell">${participants}</td>
            <td class="govuk-table__cell">${sessionDate}</td>
            <td class="govuk-table__cell">${sessionTime}</td>
            <td class="govuk-table__cell">${facilitators}</td>
          </tr>
        `
      })
      .join('')

    return `
      <table class="govuk-table govuk-!-margin-bottom-4" data-module="moj-sortable-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">Session name</th>
            <th scope="col" class="govuk-table__header">Session type</th>
            <th scope="col" class="govuk-table__header">Participants</th>
            <th scope="col" class="govuk-table__header" aria-sort="none">
              <button type="button" data-index="3" class="app-table-sort__button">
                Date of session
                <svg width="22" height="22" focusable="false" aria-hidden="true" role="img" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.1875 9.5L10.9609 3.95703L13.7344 9.5H8.1875Z" fill="currentColor"></path>
                  <path d="M13.7344 12.0781L10.9609 17.6211L8.1875 12.0781H13.7344Z" fill="currentColor"></path>
                </svg>
              </button>
            </th>
            <th scope="col" class="govuk-table__header">Time</th>
            <th scope="col" class="govuk-table__header">Facilitators</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          ${rows}
        </tbody>
      </table>
      ${this.getEstimatedDateHtml(module)}
      ${this.getScheduleSessionButtonHtml(module)}
    `
  }

  private getEstimatedDateHtml(module: (typeof this.modules)[0]) {
    const estimatedStartDateText = module.startDateText?.estimatedStartDateText
    const sessionStartDate = module.startDateText?.sessionStartDate
    const { estimatedStartDateTextlead, estimatedStartDateTexttail } = (() => {
      if (estimatedStartDateText && sessionStartDate) {
        return {
          estimatedStartDateTextlead: estimatedStartDateText,
          estimatedStartDateTexttail: `: ${sessionStartDate}`,
        }
      }
      if (estimatedStartDateText) {
        return { estimatedStartDateTextlead: estimatedStartDateText, estimatedStartDateTexttail: '' }
      }
      if (sessionStartDate) {
        return { estimatedStartDateTextlead: 'Session start date', estimatedStartDateTexttail: `: ${sessionStartDate}` }
      }
      return { estimatedStartDateTextlead: 'Estimated start date to be confirmed', estimatedStartDateTexttail: '' }
    })()

    return `
      <div class="govuk-!-margin-top-4">
        <p class="govuk-body govuk-!-margin-bottom-0"><strong>${estimatedStartDateTextlead}</strong>${estimatedStartDateTexttail}</p>
      </div>
    `
  }

  private getScheduleSessionButtonHtml(module: (typeof this.modules)[0]) {
    if (!module?.id) {
      return ''
    }

    const buttonText = module.scheduleButtonText || 'Schedule session'

    return `
      <div class="govuk-!-margin-top-4">
        <a class="govuk-button govuk-button--secondary" data-module="govuk-button" href="/${this.groupId}/${module.id}/schedule-session-type">
          ${buttonText}
        </a>
      </div>
    `
  }
}
