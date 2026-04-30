import ViewUtils from '../../utils/viewUtils'
import CreateOrEditGroupWhenPresenter from './createOrEditGroupWhenPresenter'

export default class CreateOrEditGroupWhenView {
  constructor(private readonly presenter: CreateOrEditGroupWhenPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private checkboxArgs() {
    return {
      name: 'days-of-week',
      fieldset: {
        legend: {
          text: this.presenter.isEdit ? 'Edit when will the group run' : 'When will the group run?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        html: `
          <p class="govuk-hint">Select when group sessions will run. You can add extra information later, for example about times of individual sessions.</p>
          <p class="govuk-hint">Sessions that fall on bank holidays will automatically be moved to the next scheduled date.</p>
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
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        checkboxArgs: this.checkboxArgs(),
      },
    ]
  }
}
