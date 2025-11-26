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

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
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
        homePageLink: this.homePageLink(),
        createGroupSummary: this.getCreateGroupSummary,
        cancelLink: `/`,
        text: this.presenter.text,
      },
    ]
  }
}
