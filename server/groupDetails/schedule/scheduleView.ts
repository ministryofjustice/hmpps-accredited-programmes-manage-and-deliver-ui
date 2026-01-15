import SchedulePresenter from './schedulePresenter'
import { SummaryListArgs } from '../../utils/govukFrontendTypes'

export default class ScheduleView {
  constructor(private readonly presenter: SchedulePresenter) {}

  get scheduleSummaryListArgs(): SummaryListArgs {
    return {
      rows: [
        {
          key: {
            text: 'Pre-group one-to-ones start date',
          },
          value: {
            text: 'Thursday 23 April 2026',
          },
          classes: 'govuk-summary-list__row--no-border',
        },
        {
          key: {
            text: 'Getting started module start date',
          },
          value: {
            text: 'Thursday 14 May 2026',
          },
          classes: 'govuk-summary-list__row--no-border',
        },
        {
          key: {
            text: 'End date',
          },
          value: {
            text: 'Monday 21 September 2026',
          },
          classes: 'govuk-summary-list__row--no-border',
        },
      ],
    }
  }

  get scheduleSummaryTableArgs() {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      caption: 'Schedule overview',
      captionClasses: 'govuk-table__caption--m',
      head: [
        {
          text: 'Session name',
        },
        {
          text: 'Session Type',
        },
        {
          text: 'Date',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Time',
        },
      ],
      rows: [
        [
          {
            text: 'Pre-group one-to-ones',
          },
          {
            text: 'Individual',
          },
          {
            text: 'Thursday 23 April 2026',
            attributes: {
              'data-sort-value': '6961',
            },
          },
          {
            text: 'Various Times',
          },
        ],
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/schedule/schedule',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        serviceNavigationArgs: this.presenter.getServiceNavigationArgs(),
        scheduleSummaryListArgs: this.scheduleSummaryListArgs,
        scheduleSummaryTableArgs: this.scheduleSummaryTableArgs,
      },
    ]
  }
}
