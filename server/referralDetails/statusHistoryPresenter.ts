import { ReferralDetails, ReferralStatusHistory } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export default class StatusHistoryPresenter extends ReferralLayoutPresenter {
  public readonly personOnProbationName: string

  public readonly currentStatusDescription: string

  constructor(
    readonly referralId: string,
    public readonly statusHistory: ReferralStatusHistory[],
    referralDetails: ReferralDetails,
    readonly successMessage: string | null = null,
    readonly isLdcUpdated: boolean | null = null,
    readonly isCohortUpdated: boolean | null = null,
  ) {
    super(HorizontalNavValues.statusHistoryTab, referralDetails, isLdcUpdated, isCohortUpdated)
    this.personOnProbationName = referralDetails.personName
    this.currentStatusDescription = referralDetails.currentStatusDescription
  }

  get pageHeading(): string {
    return 'Status history'
  }

  get errorMessageSummary(): MojAlertComponentArgs | null {
    return null
  }

  get successMessageSummary(): MojAlertComponentArgs | null {
    if (!this.successMessage) return null

    return {
      title: 'Referral status updated',
      text: this.successMessage,
      variant: 'success',
      dismissible: true,
      showTitleAsHeading: true,
    }
  }
}
