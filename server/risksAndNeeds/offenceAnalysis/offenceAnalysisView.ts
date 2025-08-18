import OffenceAnalysisPresenter from './offenceAnalysisPresenter'

export default class OffenceAnalysisView {
  constructor(private readonly presenter: OffenceAnalysisPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
