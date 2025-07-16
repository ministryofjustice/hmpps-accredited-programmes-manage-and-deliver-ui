import LocationPresenter from './locationPresenter'

export default class LocationView {
  constructor(private readonly presenter: LocationPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
      },
    ]
  }
}
