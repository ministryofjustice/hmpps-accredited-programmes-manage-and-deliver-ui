import SentenceInformationPresenter from './sentenceInformationPresenter'
import { InsetTextArgs, SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class SentenceInformationView {
  constructor(private readonly presenter: SentenceInformationPresenter) {}

  get sentenceDetailsSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgsWithSummaryCard(this.presenter.sentenceInformationSummaryList(), 'Sentence details'),
    }
  }

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: `Imported from NDelius on ${this.presenter.sentenceInformation.dateRetrieved}.`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        sentenceDetailsSummary: this.sentenceDetailsSummary,
        importFromDeliusText: this.importFromDeliusText,
      },
    ]
  }
}
