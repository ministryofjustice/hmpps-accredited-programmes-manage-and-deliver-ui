import { ReferralDetails, ReferralMotivationBackgroundAndNonAssociations } from '@manage-and-deliver-api'
import GroupAllocationNotesPresenter from '../groupAllocationNotesPresenter'
import { SummaryListItem } from '../../utils/summaryList'
import DateUtils from '../../utils/dateUtils'

export default class MotivationBackgroundAndNonAssociationsPresenter extends GroupAllocationNotesPresenter {
  constructor(
    readonly referral: ReferralDetails,
    readonly motivationBackgroundAndNonAssociations: ReferralMotivationBackgroundAndNonAssociations,
    readonly subNavValue: string,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
    readonly isMotivationsUpdated: boolean | null = null,
  ) {
    super(referral, subNavValue, isLdcUpdated, isCohortUpdated)
  }

  get lastUpdatedAt(): string {
    return this.motivationBackgroundAndNonAssociations.lastUpdatedAt
      ? DateUtils.formattedDate(this.motivationBackgroundAndNonAssociations.lastUpdatedAt)
      : this.motivationBackgroundAndNonAssociations.createdAt
  }

  get lastUpdatedBy(): string {
    return this.motivationBackgroundAndNonAssociations.lastUpdatedBy
      ? this.motivationBackgroundAndNonAssociations.lastUpdatedBy
      : this.motivationBackgroundAndNonAssociations.createdBy
  }

  get motivationBackgroundAndNonAssociationsSummaryListItems(): SummaryListItem[] {
    return [
      {
        key: 'Maintains innocence',
        lines: [`${this.motivationBackgroundAndNonAssociations.maintainsInnocence === true ? 'Yes' : 'No'}`],
      },
      {
        key: 'Motivation to participate in an Accredited Programme',
        lines: [`${this.motivationBackgroundAndNonAssociations.motivations}`],
      },
      {
        key: 'Other people on probation who the person should not attend a group with',
        lines: [`${this.motivationBackgroundAndNonAssociations.nonAssociations}`],
      },
      {
        key: 'Other considerations',
        lines: [`${this.motivationBackgroundAndNonAssociations.otherConsiderations}`],
      },
    ]
  }

  get text() {
    return {
      noMotivationText: `No motivation, background and non-associations added for ${this.referral.personName}`,
    }
  }
}
