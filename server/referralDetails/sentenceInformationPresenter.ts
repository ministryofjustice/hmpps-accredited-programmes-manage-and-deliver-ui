import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralDetailsPresenter from './referralDetailsPresenter'
import { SummaryListItem } from '../utils/summaryList'
import DateUtils from '../utils/dateUtils'

export default class SentenceInformationPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    readonly sentenceInformation: {
      postSentenceSupervisionEndDate: string
      licenceConditions: { code: string; description: string }[]
      requirements: { code: string; description: string }[]
      expectedEndDate: string
      custodial: boolean
      releaseType: string
      licenceExpiryDate: string
      description: string
      postSentenceSupervisionRequirements: { code: string; description: string }[]
      twoThirdsSupervisionDate: string
      startDate: string
    },
  ) {
    super(details, subNavValue, id)
  }

  communitySummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Order',
        // lines: [`${this.sentenceInformation.order}`],
        lines: [`order`],
      },
      {
        key: 'License conditions',
        lines: this.sentenceInformation.requirements.map(condition => condition.description),
      },
      {
        key: 'Order end date',
        lines: [`${this.sentenceInformation.expectedEndDate}`], // is this correct???
      },
    ]
  }

  licenseSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Sentence',
        // lines: [`${this.sentenceInformation.se}`],
        lines: [`Sentence`],
      },
      {
        key: 'Release type',
        lines: [`${this.sentenceInformation.releaseType}`],
      },
      {
        key: 'License conditions',
        lines: this.sentenceInformation.licenceConditions.map(condition => condition.description),
      },
      {
        key: 'License end date',
        lines: [`${this.sentenceInformation.licenceExpiryDate}`],
      },
      {
        key: 'Post-sentence supervision start date',
        // lines: [`${this.sentenceInformation.postSentenceSupervisionEndDate}`], // No start date????
        lines: [`Start date`],
      },
      {
        key: 'Post-sentence supervision end date',
        lines: [`${this.sentenceInformation.postSentenceSupervisionEndDate}`],
      },
      {
        key: 'Two-thirds point',
        lines: [`${this.sentenceInformation.twoThirdsSupervisionDate}`],
      },
    ]
  }

  sentenceInformationSummaryList(): SummaryListItem[] {
    // Is this how we determine community????
    if (this.sentenceInformation.custodial === false) {
      return this.communitySummaryList()
    }
    // assume this is a license condition???
    return this.licenseSummaryList()

    // const ageMonths = DateUtils.ageMonths(this.personalDetails.dateOfBirth)
    // const ageMonthsStr = ageMonths === 1 ? `, ${ageMonths} month` : `, ${ageMonths} months`

    // .filter(item => item.lines.every(line => line !== null))
  }
}
