import DrugMisusePresenter from './drugMisusePresenter'

export default class DrugMisuseView {
  constructor(private readonly presenter: DrugMisusePresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
