import { BackLinkArgs, RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import RemoveFromGroupPresenter from './removeFromGroupPresenter'

export default class RemoveFromGroupView {
  constructor(private readonly presenter: RemoveFromGroupPresenter) {}

  private backLinkArgs(): BackLinkArgs {
    return {
      text: 'Back',
      href: this.presenter.backLinkHref,
    }
  }

  private radioArgs(): RadiosArgs {
    return {
      name: 'remove-from-group',
      fieldset: {
        legend: {
          text: this.presenter.text.questionText,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      items: [
        {
          value: 'yes',
          text: 'Yes',
          checked: this.presenter.fields.removeFromGroup.value === 'yes',
        },
        {
          value: 'no',
          text: 'No',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.removeFromGroup.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/removeFromGroup/removeFromGroup',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs(),
        radioArgs: this.radioArgs(),
        cancelLink: this.presenter.backLinkHref,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
