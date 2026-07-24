import { ReferralDetails, SentenceInformation } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'
import { SummaryListItem } from '../utils/summaryList'

export default class SentenceInformationPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly sentenceInformation: SentenceInformation,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(details, subNavValue, isLdcUpdated, isCohortUpdated)
  }

  get pageTitle(): string {
    return 'Sentence information - Referral details'
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
        key: 'Licence conditions',
        lines:
          this.sentenceInformation.licenceConditions.length > 0
            ? this.sentenceInformation.licenceConditions.map(condition => condition.description)
            : ['Data not available'],
      },
      {
        key: 'Licence end date',
        lines: [`${this.sentenceInformation.licenceEndDate ?? 'Data not available'}`],
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

  get showTopDataUnavailableMessage(): boolean {
    return (
      !this.sentenceInformation.sentenceType &&
      !this.sentenceInformation.releaseType &&
      !this.sentenceInformation.orderEndDate &&
      !this.sentenceInformation.licenceEndDate &&
      !this.sentenceInformation.twoThirdsPoint &&
      (this.sentenceInformation.orderRequirements?.length ?? 0) === 0 &&
      (this.sentenceInformation.licenceConditions?.length ?? 0) === 0
    )
  }
}
