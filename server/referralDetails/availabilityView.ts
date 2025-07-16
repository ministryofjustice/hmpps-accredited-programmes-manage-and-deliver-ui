import { ButtonArgs, InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import AvailabilityPresenter from './availabilityPresenter'

export default class AvailabilityView {
  constructor(private readonly presenter: AvailabilityPresenter) {}

  get summary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.personalDetailsSummaryList(), 'Personal details'),
    }
  }

  get referralSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(
        this.presenter.referralSummaryList(),
        { showBorders: false },
        'govuk-!-margin-bottom-0',
      ),
    }
  }

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: 'Imported from NDelius on 1 August 2023, last updated on 4 January 2023',
      classes: 'govuk-!-margin-top-0',
    }
  }

  get availabilityButtonArgs(): ButtonArgs {
    return {
      text: 'Add availability',
      href: `/add-availability/${this.presenter.id}`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        summary: this.summary,
        referralSummary: this.referralSummary,
        importFromDeliusText: this.importFromDeliusText,
        availabilityButtonArgs: this.availabilityButtonArgs,
      },
    ]
  }
}
