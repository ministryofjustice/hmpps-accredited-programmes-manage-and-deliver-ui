import ReferralDetailsPresenter from './referralDetailsPresenter'

export default class ReferralDetailsView {
  constructor(private readonly presenter: ReferralDetailsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
      },
    ]
  }
}
