import PniPresenter from './pniPresenter'

export default class PniView {
  constructor(private readonly presenter: PniPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'pni/pni',
      {
        presenter: this.presenter,
        riskAndNeedsUrl: `/referral/${this.presenter.id}/risks-and-needs`,
        sexSummary: this.presenter.getSexSummary(),
        thinkingSummary: this.presenter.getThinkingSummary(),
        relationshipsSummary: this.presenter.getRelationshipsSummary(),
        selfManagementSummary: this.presenter.getSelfManagementSummary(),
        pathwayDetails: this.presenter.getPathwayDetails(),
      },
    ]
  }
}
