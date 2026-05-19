import { ReferralDetails } from '@manage-and-deliver-api'

export default class UpdateLdcPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly backlinkUri: string | null,
  ) {}

  get pageTitle(): string {
    return 'Update learning disabilities and challenges'
  }

  get fields() {
    return {
      hasLdc: {
        value: this.details.hasLdc,
      },
    }
  }
}
