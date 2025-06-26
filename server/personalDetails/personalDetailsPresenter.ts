import PersonalDetails from '../models/PersonalDetails'

export default class PersonalDetailsPresenter {
  constructor(private personalDetails: PersonalDetails) {
    this.personalDetails = personalDetails
  }
}
