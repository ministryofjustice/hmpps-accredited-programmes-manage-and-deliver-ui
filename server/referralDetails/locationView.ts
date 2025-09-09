import LocationPresenter from './locationPresenter'
import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class LocationView {
  constructor(private readonly presenter: LocationPresenter) {}

  get reportingLocationsSummary(): SummaryListArgs {
    const summary = this.presenter.ReportingLocationsSummary()
    return ViewUtils.summaryListArgsWithSummaryCard(summary.summary, summary.title)
  }

  get preferredLocationsSummary(): SummaryListArgs {
    const summary = this.presenter.PreferredLocationsSummary()
    return ViewUtils.summaryListArgsWithSummaryCard(
      summary.summary,
      summary.title,
      { showBorders: true, showTitle: true, hideKey: false },
      { href: '', text: 'Add location preferences', visuallyHiddenText: '' },
      summary.classes,
    )
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        reportingLocationsSummary: this.reportingLocationsSummary,
        preferredLocationsSummary: this.preferredLocationsSummary,
      },
    ]
  }
}
