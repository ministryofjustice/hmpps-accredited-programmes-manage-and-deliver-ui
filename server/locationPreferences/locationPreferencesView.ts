import LocationPreferencesPresenter from './locationPreferencesPresenter'
import ViewUtils from '../utils/viewUtils'

export default class LocationPreferencesView {
  constructor(private readonly presenter: LocationPreferencesPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backlinkUri,
    }
  }

  private checkboxArgs() {
    return {
      name: 'pdu-locations',
      fieldset: {
        legend: {
          text: 'East Sussex',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: `Select any locations ${this.presenter.details.personName} can attend. You can skip this question if you do not know.`,
      },
      items: [
        {
          value: 'Brighton and Hove: Brighton Probation Office',
          text: 'Brighton and Hove: Brighton Probation Office ',
        },
        {
          value: 'Hastings: St. Leonards Probation Office',
          text: 'Hastings: St. Leonards Probation Office',
        },
        {
          value: 'Hollingbury: Sussex House',
          text: 'Hollingbury: Sussex House',
        },
        {
          value: 'Lewes & Eastbourne: Eastbourne Probation Office',
          text: 'Lewes & Eastbourne: Eastbourne Probation Office',
        },
      ],
    }
  }

  private radioArgs() {
    return {
      name: 'add-other-pdu-locations',
      fieldset: {
        legend: {
          text: 'Do you want to add locations from another probation delivery unit in your region?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
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
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.otherPduRequired.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'locationPreferences/locationPreferences',
      {
        presenter: this.presenter,
        radioArgs: this.radioArgs(),
        checkboxArgs: this.checkboxArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        locationButtonFormAction: this.presenter.locationButtonFormAction,
        cancelLink: `/referral-details/${this.presenter.id}/location/#location`,
      },
    ]
  }
}
