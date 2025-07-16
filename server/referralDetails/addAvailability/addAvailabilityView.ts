import AddAvailabilityPresenter from './addAvailabilityPresenter'
import { ButtonArgs, CheckboxesArgs } from '../../utils/govukFrontendTypes'

export default class AddAvailabilityView {
  constructor(private readonly presenter: AddAvailabilityPresenter) {}

  private checkboxArgs() {
    return {
      idPrefix: 'notify-probation-practitioner',
      name: 'notify-probation-practitioner',
      fieldset: {
        legend: {
          // html: `<label class='govuk-label govuk-label--m govuk-!-margin-bottom-4'> ${ViewUtils.escape(
          //   this.presenter.questionnaire.notifyProbationPractitionerCheckboxQuestion.text
          // )}</label>`,
          // isPageHeading: false,
        },
      },
      // errorMessage: ViewUtils.govukErrorMessage(this.inputsPresenter.fields.notifyProbationPractitioner.errorMessage),
      hint: {
        text: 'Select all that apply.',
      },
      items: [...this.presenter.checkboxItems,
        {
          divider: 'or',
          classes: 'govuk-fieldset__heading',
        },
      ],
    }
  }



  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/addAvailability/addAvailability',
      {
        presenter: this.presenter,
        checkboxArgs: this.checkboxArgs(),
      },
    ]
  }
}
