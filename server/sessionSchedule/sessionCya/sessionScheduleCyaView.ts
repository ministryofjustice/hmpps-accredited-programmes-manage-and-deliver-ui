import SessionScheduleCyaPresenter from './SessionScheduleCyaPresenter'
import { SummaryListArgs } from '../../utils/govukFrontendTypes'

export default class SessionScheduleCyaView {
  constructor(private readonly presenter: SessionScheduleCyaPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get sessionScheduleSummary(): SummaryListArgs {
    const sessionDetails = this.presenter.createSessionDetails
    const editSessionTypeUrl = `${this.presenter.linkUrl}/schedule-session-type`
    const editSessionDetailsUrl = `${this.presenter.linkUrl}/schedule-group-session-details`
    return {
      rows: [
        {
          key: {
            text: 'Session name',
          },
          value: {
            text: `${sessionDetails.referralName}: ${sessionDetails.sessionName}`,
          },
        },
        {
          key: {
            text: 'Session type',
          },
          value: {
            text: 'Individual',
          },
          actions: {
            items: [
              {
                href: editSessionTypeUrl,
                text: 'Change',
                visuallyHiddenText: 'session type',
              },
            ],
          },
        },
        {
          key: {
            text: 'Date of session',
          },
          value: {
            text: this.presenter.formattedDate,
          },
          actions: {
            items: [
              {
                href: editSessionDetailsUrl,
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
            text: this.presenter.formattedTime,
          },
          actions: {
            items: [
              {
                href: editSessionDetailsUrl,
                text: 'Change',
                visuallyHiddenText: 'start or end time',
              },
            ],
          },
        },
        {
          key: {
            text: 'Participant',
          },
          value: {
            text: `${sessionDetails.referralName}`,
          },
          actions: {
            items: [
              {
                href: editSessionDetailsUrl,
                text: 'Change',
                visuallyHiddenText: 'participant',
              },
            ],
          },
        },
        {
          key: {
            text: 'Facilitators',
          },
          value: {
            html: sessionDetails.facilitators.map(facilitator => facilitator.facilitator).join('<br>'),
          },
          actions: {
            items: [
              {
                href: editSessionDetailsUrl,
                text: 'Change',
                visuallyHiddenText: 'start date',
              },
            ],
          },
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/sessionScheduleCya',
      {
        backLinkArgs: this.backLinkArgs(),
        text: this.presenter.text,
        sessionScheduleSummary: this.sessionScheduleSummary,
      },
    ]
  }
}
