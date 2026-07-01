import { SummaryListArgs } from '../../utils/govukFrontendTypes'
import SessionScheduleCyaPresenter from './SessionScheduleCyaPresenter'

export default class SessionScheduleCyaView {
  constructor(private readonly presenter: SessionScheduleCyaPresenter) {}

  private get isGroupSession(): boolean {
    return this.presenter.createSessionDetails.groupOrOneToOne?.toUpperCase() === 'GROUP'
  }

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get sessionScheduleSummary(): SummaryListArgs {
    const sessionDetails = this.presenter.createSessionDetails
    const editSessionTypeUrl = `${this.presenter.linkUrl}/schedule-session-type`
    const editSessionDetailsUrl = `${this.presenter.linkUrl}/schedule-session-details`
    return {
      rows: [
        {
          key: {
            text: 'Session name',
          },
          value: {
            text:
              sessionDetails.groupOrOneToOne.toUpperCase() === 'GROUP'
                ? `${sessionDetails.sessionName}`
                : `${sessionDetails.referralName}: ${sessionDetails.sessionName}`,
          },
        },
        {
          key: {
            text: 'Session type',
          },
          value: {
            text: this.presenter.sessionType,
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
            text: this.isGroupSession ? 'Participants' : 'Participant',
          },
          value: {
            text: `${sessionDetails.referralName}`,
          },
          actions: {
            items: [
              {
                href: editSessionDetailsUrl,
                text: 'Change',
                visuallyHiddenText: this.isGroupSession ? 'participants' : 'participant',
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
        pageTitle: this.presenter.pageTitle,
        text: this.presenter.text,
        sessionScheduleSummary: this.sessionScheduleSummary,
      },
    ]
  }
}
