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

  private get createGroupWhenArgs() {
    return {
      id: 'create-group-when',
      name: 'create-group-when',

      hint: {
        text: 'Select when group sessions will run. You can add extra information later, for example about times of individual sessions. Sessions that fall on bank holidays will automatically be moved to the next scheduled date.',
      },
      // hint: {
      //   text: 'Use the 12-hour clock, for example 9:30am or 3:00pm. Enter 12:00pm for midday',
      // },
      label: {
        text: 'When will the group run?',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupWhen.errorMessage),
      value: this.presenter.fields.createGroupWhen.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupWhen',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupWhenArgs: this.createGroupWhenArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
