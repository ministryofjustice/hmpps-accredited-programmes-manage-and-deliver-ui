import PersonalDetails from '../models/PersonalDetails'
import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class PersonalDetailsPresenter extends ReferralDetailsPresenter {
  constructor(
    readonly details: PersonalDetails,
    readonly subNavValue: string,
    readonly id: string,
  ) {
    super(details, subNavValue, id)
  }
}
