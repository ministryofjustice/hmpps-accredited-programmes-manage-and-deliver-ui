import { AccordionArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import SessionAttendancePresenter from './sessionAttendancePresenter'

export default class SessionAttendanceView {
  constructor(private readonly presenter: SessionAttendancePresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private accordionArgs(): AccordionArgs {
    const { groupId, moduleId } = this.presenter

    return {
      id: 'session-attendance-accordion',
      headingLevel: 1,
      items: this.presenter.sessionAttendanceTemplates.map(templateAttendance => ({
        heading: {
          text: templateAttendance.name,
        },
        content: {
          html: `
             <!-- <p class="govuk-body">${templateAttendance.id}</p> -->
            <a href="/group/${groupId}/module/${moduleId}/schedule-session-type?sessionAttendanceTemplateId=${templateAttendance.id}" 
               class="govuk-button" 
               data-module="govuk-button">
              Select
            </a>
          `,
        },
      })),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/sessionAttendance',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        accordionArgs: this.accordionArgs(),
        text: this.presenter.text,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
