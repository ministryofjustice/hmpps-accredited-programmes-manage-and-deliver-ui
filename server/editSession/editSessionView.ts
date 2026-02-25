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

  // We use this to catch the single referral ID in the form and pass it up to the API when no checkboxes are present
  // The ID is the same as the checkboxes to the form can hook into it but only one will ever be present on the screen
  get singleReferral() {
    return {
      label: {
        text: 'Update session and attendance',
        isPageHeading: false,
        classes: 'govuk-!-display-none',
      },
      id: 'multi-select-selected',
      name: 'multi-select-selected',
      value: this.presenter.sessionDetails.attendanceAndSessionNotes?.[0]?.referralId,
      classes: 'govuk-!-display-none',
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
        hasMultipleReferrals: this.presenter.hasMultipleReferrals,
        hasReferral: this.presenter.hasReferral,
        singleReferral: this.singleReferral,
      },
    ]
  }
}
