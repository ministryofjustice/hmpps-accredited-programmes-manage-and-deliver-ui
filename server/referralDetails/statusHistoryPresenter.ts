import { ReferralStatusHistory } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../shared/referral/referralLayoutPresenter'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export default class StatusHistoryPresenter extends ReferralLayoutPresenter {
  constructor(
    readonly referralId: string,
    public readonly statusHistory: ReferralStatusHistory[],
    readonly currentStatusDescription: string,
    private readonly personOnProbationName: string,
    private readonly isShowStatusUpdateMessageVisible: boolean,
  ) {
    super(HorizontalNavValues.statusHistoryTab, referralId, '', false)
  }

  get pageHeading(): string {
    return 'Status history'
  }

  get pageSubHeading(): string {
    return null
  }

  get errorMessageSummary(): MojAlertComponentArgs | null {
    return null;
  }

  get successMessageSummary(): MojAlertComponentArgs | null {
    if (!this.isShowStatusUpdateMessageVisible) return null;

    return {
      title: 'Referral status updated',
      text: `${this.personOnProbationName}'s referral status is now ${this.currentStatusDescription}`,
      variant: 'success',
      showTitleAsHeading: true,
    }
  }
}