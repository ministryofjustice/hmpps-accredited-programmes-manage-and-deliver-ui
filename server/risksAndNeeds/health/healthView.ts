import HealthPresenter from './healthPresenter'

export default class HealthView {
  constructor(private readonly presenter: HealthPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
