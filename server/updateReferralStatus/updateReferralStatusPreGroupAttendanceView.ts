import UpdateReferralStatusPreGroupAttendancePresenter from './updateReferralStatusPreGroupAttendancePresenter'
import { InsetTextArgs } from '../utils/govukFrontendTypes'

export default class UpdateReferralStatusPreGroupAttendanceView {
  constructor(private readonly presenter: UpdateReferralStatusPreGroupAttendancePresenter) {}

  get backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get insetText(): InsetTextArgs {
    return {
      text: `Go to group ${this.presenter.details.currentlyAllocatedGroupCode} to schedule a pre-group one-to-one or record attendance.`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'updateReferralStatus/updateReferralStatusPreGroupAttendance',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        heading: this.presenter.heading,
        backLinkArgs: this.backLinkArgs,
        cancelLinkUri: this.presenter.cancelUri,
        groupSessionsAndAttendanceUri: this.presenter.groupSessionsAndAttendanceUri,
        insetText: this.insetText,
      },
    ]
  }
}
