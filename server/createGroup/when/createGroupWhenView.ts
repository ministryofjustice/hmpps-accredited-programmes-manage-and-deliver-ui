import ViewUtils from '../../utils/viewUtils'
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

  private checkboxArgs() {
    return {
      name: 'days-of-week',
      fieldset: {
        legend: {
          text: 'When will the group run?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        html: `
        <div class="govuk-hint">
          <p>Select when group sessions will run. You can add extra information later, for example about times of individual sessions.</p>
          <p>Sessions that fall on bank holidays will automatically be moved to the next scheduled date.</p></div>
        `,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupWhen.errorMessage),
      items: this.presenter.whenWillGroupRunCheckBoxArgs,
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
        checkboxArgs: this.checkboxArgs(),
      },
    ]
  }
}
