import GroupDetailsPresenter from './groupDetailsPresenter'

export default class GroupDetailsView {
  constructor(private readonly presenter: GroupDetailsPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/groupDetails',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        serviceNavigationArgs: this.presenter.getMojSubNavigationArgs(),
      },
    ]
  }
}
