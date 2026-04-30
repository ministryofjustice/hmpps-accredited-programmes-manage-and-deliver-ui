import CreateGroupStartPresenter from './createGroupStartPresenter'

export default class CreateGroupStartView {
  constructor(private readonly presenter: CreateGroupStartPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupStart',
      {
        backLinkArgs: this.backLinkArgs(),
      },
    ]
  }
}
