import RisksAndAlertsPresenter from './risksAndAlertsPresenter'

export default class RisksAndAlertsView {
  constructor(private readonly presenter: RisksAndAlertsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
