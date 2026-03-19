import { ReferralDetails } from '@manage-and-deliver-api'
import ReferralLayoutPresenter, { HorizontalNavValues } from '../../shared/referral/referralLayoutPresenter'

export default class AttendanceHistoryPresenter extends ReferralLayoutPresenter {
  constructor(readonly referralDetails: ReferralDetails) {
    super(HorizontalNavValues.attendanceHistoryTab, referralDetails)
  }

  get headingText() {
    return `Attendance history: ${this.referralDetails.personName}`
  }
}
