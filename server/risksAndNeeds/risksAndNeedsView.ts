import RisksAndNeedsPresenter from './risksAndNeedsPresenter'

export default class RisksAndNeedsView {
  constructor(private readonly presenter: RisksAndNeedsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
