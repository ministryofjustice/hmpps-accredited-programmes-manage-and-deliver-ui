import AddToGroupPresenter from './addToGroupPresenter'
import { BackLinkArgs, RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class AddToGroupView {
  constructor(private readonly presenter: AddToGroupPresenter) {}

  private backLinkArgs(): BackLinkArgs {
    return {
      text: 'Back',
      href: this.presenter.backLinkHref,
    }
  }

  private radioArgs(): RadiosArgs {
    return {
      name: 'add-to-group',
      fieldset: {
        legend: {
          text: this.presenter.text.questionText,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        text: 'Once you add someone to a group, their referral status will change to Scheduled in the case list and in NDelius',
      },
      items: [
        {
          value: 'yes',
          text: 'Yes',
        },
        {
          value: 'no',
          text: 'No',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.addToGroup.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/addToGroup/addToGroup',
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
