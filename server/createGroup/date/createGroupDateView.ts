import ViewUtils from '../../utils/viewUtils'
import CreateGroupDatePresenter from './createGroupDatePresenter'

export default class CreateGroupDateView {
  constructor(private readonly presenter: CreateGroupDatePresenter) {}

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
        text: 'Add a start date for the group',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupDate.errorMessage),
      value: this.presenter.fields.createGroupDate.value,
      excludedDates: this.presenter.excludedDates,
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
