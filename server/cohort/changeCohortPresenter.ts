import { ReferralDetails } from '@manage-and-deliver-api'

export default class ChangeCohortPresenter {
  constructor(
    readonly id: string,
    readonly details: ReferralDetails,
    readonly backlinkUri: string | null,
  ) {}

  get changeCohortFormAction(): string {
    return `/referral/${this.id}/change-cohort`
  }

  get fields() {
    return {
      updatedCohort: {
        value: this.details.cohort,
      },
    }
  }
}
