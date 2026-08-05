import { SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import LocationPresenter from './locationPresenter'
import withSuccessScreenReaderAnnouncement from '../../utils/alertUtils'

export default class LocationView {
  constructor(private readonly presenter: LocationPresenter) {}

  get getPreferredLocationsAsSummaryListArgs(): SummaryListArgs {
    const summary = this.presenter.preferredLocationsSummary()
    const addLocationPreferenceHref = `/referral/${this.presenter.referral.id}/add-location-preferences`
    return ViewUtils.summaryListArgsWithSummaryCard(
      summary.summary,
      summary.title,
      { showBorders: true, showTitle: true, hideKey: false },
      { href: addLocationPreferenceHref, text: this.presenter.linkText, visuallyHiddenText: '' },
      summary.classes,
    )
  }

  get getLocationsAsSummaryListArgs(): SummaryListArgs {
    const summary = this.presenter.locationsSummary()
    return ViewUtils.summaryListArgsWithSummaryCard(summary.summary, summary.title, {
      showBorders: true,
      showTitle: true,
      hideKey: false,
    })
  }

  get pageTitle(): string {
    return 'Locations the person can attend a programme'
  }

  private successMessageArgs() {
    return withSuccessScreenReaderAnnouncement({
      variant: 'success',
      title: 'Location details added successfully.',
      text: '',
      showTitleAsHeading: true,
      dismissible: true,
    })
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'availabilityAndMotivation/availabilityAndMotivation',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        getPreferredLocationsAsSummaryListArgs: this.getPreferredLocationsAsSummaryListArgs,
        getLocationsAsSummaryListArgs: this.getLocationsAsSummaryListArgs,
        isPreferredLocationUpdated: this.presenter.isPreferredLocationUpdated,
        successMessageArgs: this.successMessageArgs(),
        getVerticalSubNavArgs: this.presenter.verticalSubNavArgs,
        groupAllocationTextArgs: this.presenter.groupAllocationTextArgs,
      },
    ]
  }
}
