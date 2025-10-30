import { InputArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import CreateGroupCodePresenter from './createGroupCodePresenter'

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

  private get createGroupCodeArgs(): InputArgs {
    return {
      id: 'createGroupCode',
      name: 'createGroupCode',
      hint: {
        text: 'For example, BCCDD1. This will be used to identify your group.',
      },
      label: {
        text: 'Create a group code',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      value: '',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupCode',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupCodeArgs: this.createGroupCodeArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
