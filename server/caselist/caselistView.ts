import CaselistPresenter from './caselistPresenter'

export default class CaselistView {
  constructor(private readonly presenter: CaselistPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'caselist/caselist',
      {
        presenter: this.presenter,
        subNavArgs: this.presenter.getSubNavArgs(),
        selectedFilters: this.presenter.generateFilterPane(),
      },
    ]
  }
}
