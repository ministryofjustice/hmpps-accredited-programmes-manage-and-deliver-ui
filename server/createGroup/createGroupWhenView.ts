import ViewUtils from '../utils/viewUtils'
import CreateGroupWhenPresenter from './createGroupWhenPresenter'

export default class CreateGroupWhenView {
  constructor(private readonly presenter: CreateGroupWhenPresenter) {}

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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupWhen',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        selectedDays: this.presenter.selectedDays,
        dayTimes: this.presenter.dayTimes,
      },
    ]
  }
}
