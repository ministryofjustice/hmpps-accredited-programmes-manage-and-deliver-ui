import { BackLinkArgs, ButtonArgs } from '../../utils/govukFrontendTypes'
import AddToGroupMoreDetailsPresenter from './addToGroupMoreDetailsPresenter'
import ViewUtils from '../../utils/viewUtils'

export default class AddToGroupMoreDetailsView {
  constructor(private readonly presenter: AddToGroupMoreDetailsPresenter) {}

  private backLinkArgs(): BackLinkArgs {
    return {
      text: 'Back',
      href: this.presenter.backLinkHref,
    }
  }

  private addDetailsCharacterCountArgs() {
    return {
      name: 'add-details',
      id: 'add-details',
      maxlength: '500',
      label: {
        text: 'Add details(optional)',
        classes: 'govuk-label govuk-label--s',
      },
      hint: {
        text: `You can add more information about this update if you need to`,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.addDetails.errorMessage),
      value: this.presenter.fields.addDetails.value,
    }
  }

  private submitButtonArgs(): ButtonArgs {
    return { text: 'Submit', preventDoubleClick: true }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/addToGroup/addToGroupMoreDetails',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs(),
        cancelLink: this.presenter.backLinkHref,
        addDetailsCharacterCountArgs: this.addDetailsCharacterCountArgs(),
        submitButtonArgs: this.submitButtonArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
