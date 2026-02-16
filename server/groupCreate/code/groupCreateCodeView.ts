import { InputArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupCodePresenter from './groupCreateCodePresenter'

export default class CreateGroupCodeView {
  constructor(private readonly presenter: CreateGroupCodePresenter) {}

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

  private createGroupCodeArgs(): InputArgs {
    return {
      id: 'create-group-code',
      name: 'create-group-code',
      hint: {
        text: 'For example, BCCDD1. This will be used to identify your group.',
      },
      label: {
        text: 'Create a group code',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupCode.errorMessage),
      value: this.presenter.fields.createGroupCode.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupCreate/groupCreateCode',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupCodeArgs: this.createGroupCodeArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
