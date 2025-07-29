import { ReferralDetails } from '@manage-and-deliver-api'
import DateUtils from '../utils/dateUtils'
import { convertToTitleCase } from '../utils/utils'

export default class ServiceUserBannerPresenter {
  constructor(private readonly referralDetails: ReferralDetails) {}

  get name(): string {
    return convertToTitleCase(`${this.referralDetails.personName}`)
  }

  get dateOfBirth(): string {
    if (this.referralDetails.dateOfBirth) {
      const ageYears = DateUtils.age(this.referralDetails.dateOfBirth)
      return `${DateUtils.formattedDate(this.referralDetails.dateOfBirth)} (${ageYears} years old)`
    }
    return 'Not found'
  }

  get crn(): string {
    return this.referralDetails.crn
  }
}
