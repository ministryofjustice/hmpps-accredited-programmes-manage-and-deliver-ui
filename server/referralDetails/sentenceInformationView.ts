import SentenceInformationPresenter from './sentenceInformationPresenter'
import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class SentenceInformationView {
  constructor(private readonly presenter: SentenceInformationPresenter) {}

  get sentenceDetailsSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(
        this.presenter.sentenceInformationSummaryList(),
        'Sentence Information',
      ),
    }
  }

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: `Imported from NDelius on ${this.presenter.sentenceInformation.dateRetrieved} last updated on ${this.presenter.sentenceInformation.dateRetrieved}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        sentenceDetailsSummary: this.sentenceDetailsSummary,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
