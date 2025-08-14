import RoshAnalysisPresenter from './roshAnalysisPresenter'

export default class RoshAnalysisView {
  constructor(private readonly presenter: RoshAnalysisPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
