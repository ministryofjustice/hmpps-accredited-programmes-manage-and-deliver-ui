import ReferralDetailsPresenter from './referralDetailsPresenter'
import { formatCohort } from '../utils/utils'

export default class ReferralDetailsView {
  constructor(private readonly presenter: ReferralDetailsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
        successMessageArgs: this.cohortUpdatedSuccessMessageArgs,
        isCohortUpdated: this.presenter.isCohortUpdated,
      },
    ]
  }

  private cohortUpdatedSuccessMessageArgs() {
    return {
      variant: 'success',
      title: 'Cohort changed',
      showTitleAsHeading: true,
      dismissible: true,
      text: `${this.presenter.referralDetails.personName} is in the ${formatCohort(this.presenter.referralDetails.cohort)} cohort`,
    }
  }
}
