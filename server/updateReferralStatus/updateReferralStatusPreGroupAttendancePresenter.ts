import { ReferralDetails } from '@manage-and-deliver-api'

export default class UpdateReferralStatusPreGroupAttendancePresenter {
  constructor(
    readonly details: ReferralDetails,
    readonly groupId: string,
    readonly backLinkUri: string,
    readonly cancelUri: string,
  ) {}

  get pageTitle(): string {
    return 'Record pre-group attendance'
  }

  get heading(): string {
    return `${this.details.personName} must attend their pre-group one-to-one to be On programme`
  }

  get groupSessionsAndAttendanceUri(): string {
    return `/group/${this.groupId}/sessions-and-attendance`
  }
}
