import ViewUtils from '../../utils/viewUtils'
import CreateOrEditGroupDatePresenter from './createOrEditGroupDatePresenter'

export default class CreateOrEditGroupDateView {
  constructor(private readonly presenter: CreateOrEditGroupDatePresenter) {}

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

  private get createGroupDateArgs() {
    return {
      id: 'create-group-date',
      name: 'create-group-date',

      hint: {
        text: 'This is when the pre-group one-to-ones are expected to start. Enter a date, for example, 10/7/2025, or select one from the calendar.',
      },
      label: {
        text: this.presenter.isEdit ? 'Edit start date for the group' : 'Add a start date for the group',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupDate.errorMessage),
      value: this.presenter.fields.createGroupDate.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupDate',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupDateArgs: this.createGroupDateArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
