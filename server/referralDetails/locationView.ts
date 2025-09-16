import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import LocationPresenter from './locationPresenter'

export default class LocationView {
  constructor(private readonly presenter: LocationPresenter) {}

  get getPreferredLocationsAsSummaryListArgs(): SummaryListArgs {
    const summary = this.presenter.preferredLocationsSummary()
    const addLocationPreferenceHref = `/referral/${this.presenter.referralId}/add-location-preferences`
    return ViewUtils.summaryListArgsWithSummaryCard(
      summary.summary,
      summary.title,
      { showBorders: true, showTitle: true, hideKey: false },
      { href: addLocationPreferenceHref, text: 'Add location preferences', visuallyHiddenText: '' },
      summary.classes,
    )
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        getPreferredLocationsAsSummaryListArgs: this.getPreferredLocationsAsSummaryListArgs,
      },
    ]
  }
}
