import EmotionalWellbeingPresenter from './emotionalWellbeingPresenter'

export default class EmotionalWellbeingView {
  constructor(private readonly presenter: EmotionalWellbeingPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'risksAndNeeds/risksAndNeeds',
      {
        presenter: this.presenter,
      },
    ]
  }
}
