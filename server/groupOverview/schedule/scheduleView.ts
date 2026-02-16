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
            text: this.presenter.groupSchedule.preGroupOneToOneStartDate,
          },
          classes: 'govuk-summary-list__row--no-border',
        },
        {
          key: {
            text: 'Getting started module start date',
          },
          value: {
            text: this.presenter.groupSchedule.gettingStartedModuleStartDate,
          },
          classes: 'govuk-summary-list__row--no-border',
        },
        {
          key: {
            text: 'End date',
          },
          value: {
            text: this.presenter.groupSchedule.endDate,
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
          text: 'Session type',
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
      rows: this.presenter.scheduleTableRows,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupOverview/schedule/schedule',
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
