import { ReferralDetails } from '@manage-and-deliver-api'

export default class UpdateLdcPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly backlinkUri: string | null,
  ) {}

  get updateLdcFormAction(): string {
    return `/referral/${this.id}/update-ldc`
  }

  get fields() {
    return {
      hasLdc: {
        value: this.details.hasLdc,
      },
    }
  }
}
