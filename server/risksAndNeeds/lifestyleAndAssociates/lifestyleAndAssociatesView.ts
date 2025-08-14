import LifestyleAndAssociatesPresenter from './lifestyleAndAssociatesPresenter'

export default class LifestyleAndAssociatesView {
  constructor(private readonly presenter: LifestyleAndAssociatesPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
