import { InputArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateOrEditGroupCodePresenter from './createOrEditGroupCodePresenter'

export default class CreateOrEditGroupCodeView {
  constructor(private readonly presenter: CreateOrEditGroupCodePresenter) {}

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
        text: this.presenter.pageTitle,
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupCode.errorMessage),
      value: this.presenter.fields.createGroupCode.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupCode',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        captionText: this.presenter.captionText,
        createGroupCodeArgs: this.createGroupCodeArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        submitButtonText: this.presenter.submitButtonText,
      },
    ]
  }
}
