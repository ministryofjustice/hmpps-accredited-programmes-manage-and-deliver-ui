import StatusHistoryPresenter from './statusHistoryPresenter'

export default class StatusHistoryView {
  constructor(private readonly presenter: StatusHistoryPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referrals/show/statusHistory/show',
      {
        presenter: this.presenter,
        pageHeading: this.presenter.pageHeading,
        pageSubHeading: this.presenter.pageSubHeading,
        timelineItems: this.presenter.timelineItems,
        subNavigationItems: this.presenter.getHorizontalSubNavArgs().items,
        buttons: this.presenter.getSubHeaderArgs().items,
        buttonMenu: { items: [] }
      },
    ]
  }
}