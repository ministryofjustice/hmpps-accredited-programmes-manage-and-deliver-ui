import AddAvailabilityPresenter from './addAvailabilityDatesPresenter'
import ViewUtils from '../../utils/viewUtils'

export default class AddAvailabilityDatesView {
  constructor(
    private readonly presenter: AddAvailabilityPresenter,
    private readonly id: string,
  ) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: `/add-availability/${this.id}`,
    }
  }

  private datePickerArgs() {
    return {
      id: 'date',
      name: 'date',
      label: {
        text: 'Date',
      },
      hint: {
        text: 'For example, 17/5/2024.',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.endDate.errorMessage),
      value: this.presenter.fields.endDate.value,
      minDate: new Date().toLocaleDateString('en-GB'),
    }
  }

  private radioArgs(dateHtml: string) {
    return {
      name: 'end-date',
      fieldset: {
        legend: {
          text: 'Do you want to add an end date for this availability?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        text: 'If you know this availability will change, for example if someone is starting a new job or travelling, add the date it will change.',
      },
      items: [
        {
          value: 'Yes',
          text: 'Yes',
          conditional: {
            html: dateHtml,
          },
        },
        {
          value: 'No',
          text: 'No',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.endDateRequired.errorMessage),
      value: this.presenter.fields.endDateRequired.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/addAvailability/addAvailabilityDates',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs(),
        radioArgs: this.radioArgs.bind(this),
        datePickerArgs: this.datePickerArgs(),
        backlinkUri: `/add-availability/${this.id}`,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
