import { SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupCyaPresenter from './createGroupCyaPresenter'

export default class CreateGroupCyaView {
  constructor(private readonly presenter: CreateGroupCyaPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get getCreateGroupSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.getCreateGroupSummary()),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupCya',
      {
        backLinkArgs: this.backLinkArgs(),
        createGroupSummary: this.getCreateGroupSummary,
        cancelLink: `/`,
        text: this.presenter.text,
      },
    ]
  }
}
