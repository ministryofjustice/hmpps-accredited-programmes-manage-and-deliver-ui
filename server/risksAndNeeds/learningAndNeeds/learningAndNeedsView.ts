import LearningAndNeedsPresenter from './learningAndNeedsPresenter'

export default class LearningAndNeedsView {
  constructor(private readonly presenter: LearningAndNeedsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
