import CannotAttendLocationsPresenter from './cannotAttendLocationsPresenter'
import ViewUtils from '../utils/viewUtils'
import { RadiosArgs } from '../utils/govukFrontendTypes'

export default class CannotAttendLocationsView {
  constructor(private readonly presenter: CannotAttendLocationsPresenter) {}

  // private previousValueArgs() {
  //   if (!this.presenter.currentFormData.pdus || this.presenter.currentFormData.pdus.length === 0) {
  //     return {
  //       html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">East Sussex</p><p class="govuk-body">No information added</p>`,
  //     }
  //   }
  //   return {
  //     html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">East Sussex</p>${[]
  //       .concat(this.presenter.currentFormData.pdus)
  //       .map(pdu => `<p class="govuk-!-margin-0">${pdu}</p>`)
  //       .join('')}`,
  //   }
  // }

  private radioArgs(textInputAreaHtml: string): RadiosArgs {
    return {
      name: 'cannot-attend-locations-radio',
      fieldset: {
        legend: {
          text: `Are there any locations ${this.presenter.details.personName} cannot attend?`,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      items: [
        {
          value: 'yes',
          text: 'Yes',
          conditional: {
            html: textInputAreaHtml,
          },
        },
        {
          value: 'no',
          text: 'No',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.cannotAttendLocationsRadioButton.errorMessage),
    }
  }

  private cannotAttendLocationsTextAreaArgs() {
    return {
      name: 'cannot-attend-locations-text-area',
      id: 'cannot-attend-locations-text-area',
      maxlength: '2000',
      label: {
        text: this.presenter.text.cannotAttendTextArea.label,
        classes: 'govuk-label--m',
      },
      hint: {
        html: `Include: <ul class="govuk-list--bullet govuk-!-margin-top-0"><li>which locations they cannot attend</li><li>the reason why</li></ul>`,
      },
      value: this.presenter.fields.cannotAttendLocationsTextArea.value,
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.cannotAttendLocationsTextArea.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'locationPreferences/cannotAttendLocations',
      {
        presenter: this.presenter,
        // previousValueArgs: this.previousValueArgs(),
        cancelLink: `/referral-details/${this.presenter.id}/location/#location`,
        cannotAttendLocationsTextAreaArgs: this.cannotAttendLocationsTextAreaArgs(),
        radioArgs: this.radioArgs.bind(this),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
