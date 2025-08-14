import ProgrammeNeedsIdentifierPresenter from './programmeNeedsIdentifierPresenter'

export default class ProgrammeNeedsIdentifierView {
  constructor(private readonly presenter: ProgrammeNeedsIdentifierPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'programmeNeedsIdentifier/programmeNeedsIdentifier',
      {
        presenter: this.presenter,
        riskAndNeedsUrl: `/referral/${this.presenter.id}/risks-and-needs`,
      },
    ]
  }
}
