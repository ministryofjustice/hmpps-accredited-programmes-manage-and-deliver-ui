import { ReferralDetails, SentenceInformation } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'
import { SummaryListItem } from '../utils/summaryList'

export default class SentenceInformationPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    readonly sentenceInformation: SentenceInformation,
  ) {
    super(details, subNavValue, id)
  }

  orderSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Sentence type',
        lines: [`${this.sentenceInformation.sentenceType ?? 'Data not available'}`],
      },
      {
        key: 'Order requirements',
        lines:
          this.sentenceInformation.orderRequirements.length > 0
            ? this.sentenceInformation.orderRequirements.map(condition => condition.description)
            : ['Data not available'],
      },
      {
        key: 'Order end date',
        lines: [`${this.sentenceInformation.orderEndDate ?? 'Data not available'}`],
      },
    ]
  }

  licenseSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Sentence type',
        lines: [`${this.sentenceInformation.sentenceType ?? 'Data not available'}`],
      },
      {
        key: 'Release type',
        lines: [`${this.sentenceInformation.releaseType ?? 'Data not available'}`],
      },
      {
        key: 'License conditions',
        lines:
          this.sentenceInformation.licenceConditions.length > 0
            ? this.sentenceInformation.licenceConditions.map(condition => condition.description)
            : ['Data not available'],
      },
      {
        key: 'License end date',
        lines: [`${this.sentenceInformation.licenceEndDate ?? 'Data not available'}`],
      },
      {
        key: 'Post-sentence supervision start date',
        lines: [`${this.sentenceInformation.postSentenceSupervisionStartDate ?? 'Data not available'}`],
      },
      {
        key: 'Post-sentence supervision end date',
        lines: [`${this.sentenceInformation.postSentenceSupervisionEndDate ?? 'Data not available'}`],
      },
      {
        key: 'Two-thirds point',
        lines: [`${this.sentenceInformation.twoThirdsPoint ?? 'Data not available'}`],
      },
    ]
  }

  sentenceInformationSummaryList(): SummaryListItem[] {
    if (this.sentenceInformation.orderRequirements.length > 0) {
      return this.orderSummaryList()
    }
    return this.licenseSummaryList()
  }
}
