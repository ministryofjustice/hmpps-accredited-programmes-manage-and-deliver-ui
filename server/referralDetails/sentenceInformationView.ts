import SentenceInformationPresenter from './sentenceInformationPresenter'

export default class SentenceInformationView {
  constructor(private readonly presenter: SentenceInformationPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
      },
    ]
  }
}
