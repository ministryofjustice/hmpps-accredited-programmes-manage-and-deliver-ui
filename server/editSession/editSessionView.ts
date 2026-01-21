import EditSessionPresenter from './editSessionPresenter'
import { SummaryListArgs, TableArgs } from '../utils/govukFrontendTypes'
import { GroupDetailsPageSection } from '../groupDetails/groupDetailsPresenter'

export default class EditSessionView {
  constructor(private readonly presenter: EditSessionPresenter) {}

  get editSessionSummary(): SummaryListArgs {
    return {
      rows: [
        {
          key: {
            text: 'Session type',
          },
          value: {
            text: `Group`,
          },
        },
        {
          key: {
            text: 'Date',
          },
          value: {
            text: 'Thursday 14 May 2026',
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
            text: '11am to 1:30pm',
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
            text: `People`,
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
            // html: sessionDetails.facilitators.map(facilitator => facilitator.facilitator).join('<br>'),
            text: 'More People',
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

  get attendanceAndNotesTableArgs(): TableArgs {
    return {
      head: [{ text: '' }, { text: 'Name and CRN' }, { text: 'Attendance' }, { text: 'Session notes' }],
      rows: [
        [
          {
            html: `<div class="govuk-checkboxes govuk-checkboxes--small attendance-and-notes-table">
                    <div class="govuk-checkboxes__item">
                      <input class="govuk-checkboxes__input" id="X12345" name="attendanceAndNotes" type="checkbox" value="X12345">
                      <label class="govuk-label govuk-checkboxes__label" for="X12345">
                        <p class="govuk-!-margin-bottom-0"><a href="">Sham Booth</a></p>
                        <p class="govuk-!-margin-bottom-0">X12346</p>
                      </label>
                     </div>
                 </div>`,
          },
          { text: 'Name' },
          { html: `<strong class="govuk-tag">Attended</strong>` },
          { text: 'Good session' },
        ],
        [
          {
            html: `<div class="govuk-checkboxes govuk-checkboxes--small attendance-and-notes-table">
                    <div class="govuk-checkboxes__item">
                      <input class="govuk-checkboxes__input" id="X99999" name="attendanceAndNotes" type="checkbox" value="X99999">
                      <label class="govuk-label govuk-checkboxes__label" for="X99999">
                        <p class="govuk-!-margin-bottom-0"><a href="">Dave Daves</a></p>
                        <p class="govuk-!-margin-bottom-0">X99999</p>
                      </label>
                     </div>
                 </div>`,
          },
          { text: 'Name' },
          { html: `<strong class="govuk-tag">Attended</strong>` },
          { text: 'Good session' },
        ],
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
        attendanceAndNotesTableArgs: this.attendanceAndNotesTableArgs,
      },
    ]
  }
}
