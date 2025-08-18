import AttitudesPresenter from './attitudesPresenter'

export default class AttitudesView {
  constructor(private readonly presenter: AttitudesPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
