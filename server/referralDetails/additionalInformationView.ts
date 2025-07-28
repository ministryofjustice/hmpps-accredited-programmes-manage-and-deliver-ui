import AdditionalInformationPresenter from './additionalInformationPresenter'

export default class AdditionalInformationView {
  constructor(private readonly presenter: AdditionalInformationPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
      },
    ]
  }
}
