import ProgrammeHistoryPresenter from './programmeHistoryPresenter'

export default class ProgrammeHistoryView {
  constructor(private readonly presenter: ProgrammeHistoryPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/referralDetails',
      {
        presenter: this.presenter,
      },
    ]
  }
}
