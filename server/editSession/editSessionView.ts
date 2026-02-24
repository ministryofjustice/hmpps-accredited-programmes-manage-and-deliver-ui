import { ButtonArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import EditSessionPresenter from './editSessionPresenter'
import ViewUtils from '../utils/viewUtils'

export default class EditSessionView {
  constructor(private readonly presenter: EditSessionPresenter) {}

  get editSessionSummary(): SummaryListArgs {
    const sessionDetailsObj = this.presenter.sessionDetails
    return {
      rows: [
        {
          key: {
            text: 'Session type',
          },
          value: {
            text: sessionDetailsObj.sessionType,
          },
        },
        {
          key: {
            text: 'Date',
          },
          value: {
            text: sessionDetailsObj.date,
          },
          actions: {
            items: [
              {
                href: `/group/${this.presenter.groupId}/session/${this.presenter.sessionId}/edit-session-date-and-time`,
                text: 'Change',
                visuallyHiddenText: 'start date',
              },
            ],
          },
        },
        {
          key: {
            text: 'Time',
          },
          value: {
            text: sessionDetailsObj.time,
          },
          actions: {
            items: [
              {
                href: `/group/${this.presenter.groupId}/session/${this.presenter.sessionId}/edit-session-date-and-time`,
                text: 'Change',
                visuallyHiddenText: 'start time',
              },
            ],
          },
        },
        {
          key: {
            text: 'Scheduled to attend',
          },
          value: {
            html: sessionDetailsObj.scheduledToAttend.join(
              '<span class="govuk-!-display-block govuk-!-margin-bottom-1"></span>',
            ),
          },
          actions: {
            items: [
              {
                href: `/group/${this.presenter.groupId}/session/${this.presenter.sessionId}/edit-session-attendees`,
                text: 'Change',
                visuallyHiddenText: 'participants',
              },
            ],
          },
        },
        {
          key: {
            text: 'Facilitators',
          },
          value: {
            html: sessionDetailsObj.facilitators.join(
              '<span class="govuk-!-display-block govuk-!-margin-bottom-1"></span>',
            ),
          },
          actions: {
            items: [
              {
                href: `/group/${this.presenter.groupId}/session/${this.presenter.sessionId}/edit-session-facilitators`,
                text: 'Change',
                visuallyHiddenText: 'facilitators',
              },
            ],
          },
        },
      ],
    }
  }

  private get successMessageArgs() {
    if (!this.presenter.successMessage) {
      return null
    }

    return {
      variant: 'success',
      title: this.presenter.successMessage,
      showTitleAsHeading: true,
      dismissible: true,
    }
  }

  get deleteButton(): ButtonArgs {
    return {
      text: 'Delete session',
      href: this.presenter.deleteUrl,
      classes: 'govuk-button--secondary',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/editSession',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        backLinkArgs: this.presenter.backLinkArgs,
        editSessionSummary: this.editSessionSummary,
        successMessageArgs: this.successMessageArgs,
        deleteButton: this.deleteButton,
        canBeDeleted: this.presenter.canBeDeleted,
        attendanceTableArgs: this.presenter.attendanceTableArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
