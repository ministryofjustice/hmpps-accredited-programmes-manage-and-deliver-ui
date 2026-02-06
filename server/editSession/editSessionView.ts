import { SummaryListArgs } from '../utils/govukFrontendTypes'
import EditSessionPresenter from './editSessionPresenter'

export default class EditSessionView {
  constructor(private readonly presenter: EditSessionPresenter) {}

  get editSessionSummary(): SummaryListArgs {
    const sessionDetailsObj = this.presenter.sessionDetails
    const editSessionFacilitatorsUrl = `${this.presenter.linkUrl}/edit-session-facilitators`
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
                href: editSessionFacilitatorsUrl,
                text: 'Change',
                visuallyHiddenText: 'facilitators',
              },
            ],
          },
        },
      ],
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
      },
    ]
  }
}
