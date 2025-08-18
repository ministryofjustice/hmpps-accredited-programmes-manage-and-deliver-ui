import ThinkingAndBehavingPresenter from './thinkingAndBehavingPresenter'

export default class ThinkingAndBehavingView {
  constructor(private readonly presenter: ThinkingAndBehavingPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
