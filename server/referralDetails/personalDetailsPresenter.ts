import { PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import DateUtils from '../utils/dateUtils'
import { InsetTextArgs } from '../utils/govukFrontendTypes'
import { SummaryListItem } from '../utils/summaryList'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class PersonalDetailsPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly referralDetails: ReferralDetails,
    readonly subNavValue: string,
    readonly id: string,
    private personalDetails: PersonalDetails,
    readonly isCohortUpdated: boolean | null = null,
    readonly isLdcUpdated: boolean | null = null,
  ) {
    super(referralDetails, subNavValue, id, isCohortUpdated)
  }

  get importFromDeliusText(): InsetTextArgs {
    return {
      text: `Imported from NDelius on ${this.personalDetails.dateRetrieved}, last updated on ${this.personalDetails.dateRetrieved}`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  personalDetailsSummaryList(): SummaryListItem[] {
    return [
      {
        key: 'Name',
        lines: [`${this.personalDetails.name}`],
      },
      {
        key: 'CRN',
        lines: [this.personalDetails.crn],
      },
      {
        key: 'Date of birth',
        lines: [`${DateUtils.formattedDate(this.personalDetails.dateOfBirth)} (${this.personalDetails.age} old)`],
      },
      {
        key: 'Ethnicity',
        lines: [this.personalDetails.ethnicity],
      },
      {
        key: 'Gender',
        lines: [this.personalDetails.gender],
      },
      {
        key: 'Setting',
        lines: [this.personalDetails.setting],
      },
      {
        key: 'Probation delivery unit',
        lines: [this.personalDetails.probationDeliveryUnit],
      },
    ].filter(item => item.lines.every(line => line !== null))
  }
}
