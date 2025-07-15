import DateUtils from '../utils/dateUtils'
import { convertToTitleCase } from '../utils/utils'

export default class ServiceUserBannerPresenter {
  constructor(
    private readonly serviceUser: { name: { forename: string; surname: string }; dateOfBirth: string; crn: string },
  ) {}

  get name(): string {
    return convertToTitleCase(`${this.serviceUser.name.forename} ${this.serviceUser.name.surname}`)
  }

  get dateOfBirth(): string {
    if (this.serviceUser.dateOfBirth) {
      const ageYears = DateUtils.age(this.serviceUser.dateOfBirth)
      return `${DateUtils.formattedDate(this.serviceUser.dateOfBirth)} (${ageYears} years old)`
    }
    return 'Not found'
  }

  get crn(): string {
    return this.serviceUser.crn
  }
}
