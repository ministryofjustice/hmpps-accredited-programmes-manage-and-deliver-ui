import EditSessionPresenter from './editSessionPresenter'
import { ButtonArgs, SummaryListArgs } from '../utils/govukFrontendTypes'

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
                href: '',
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
                href: '',
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
            html: sessionDetailsObj.scheduledToAttend.join('<br>'),
          },
          actions: {
            items: [
              {
                href: '',
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
            html: sessionDetailsObj.facilitators.join('<br>'),
          },
          actions: {
            items: [
              {
                href: '',
                text: 'Change',
                visuallyHiddenText: 'facilitators',
              },
            ],
          },
        },
      ],
    }
  }

  get deleteButton(): ButtonArgs {
    return {
      text: 'Delete session',
      href: this.presenter.deleteUrl,
      classes: 'govuk-buttoon-secondary',
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
        deleteButton: this.deleteButton,
      },
    ]
  }
}
