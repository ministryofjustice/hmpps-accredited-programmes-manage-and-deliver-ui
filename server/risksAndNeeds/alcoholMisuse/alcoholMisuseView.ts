import AlcoholMisusePresenter from './alcoholMisusePresenter'

export default class AlcoholMisuseView {
  constructor(private readonly presenter: AlcoholMisusePresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
