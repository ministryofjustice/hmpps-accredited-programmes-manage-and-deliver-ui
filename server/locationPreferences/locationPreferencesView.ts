import LocationPreferencesPresenter from './locationPreferencesPresenter'
import ViewUtils from '../utils/viewUtils'
import { RadiosArgs } from '../utils/govukFrontendTypes'

export default class LocationPreferencesView {
  private primaryPduName = `No Primary Probation Delivery Unit Found`

  private deliveryLocations: { value: string; text: string; checked: boolean }[] = []

  constructor(private readonly presenter: LocationPreferencesPresenter) {
    const primaryPdu = presenter.deliveryLocationOptions.find(({ pdu }) => pdu.isPrimaryPduForReferral)
    const selectedValues = presenter.preferredLocationReferenceData.existingDeliveryLocationPreferences
      ? presenter.preferredLocationReferenceData.existingDeliveryLocationPreferences.canAttendLocationsValues.map(
          item => item.value,
        )
      : []

    if (primaryPdu) {
      this.deliveryLocations = primaryPdu.offices.map(({ label, value }) => ({ text: label, value, checked: false }))
      this.deliveryLocations = this.deliveryLocations.map(location => ({
        ...location,
        checked: selectedValues.includes(location.value),
      }))
      this.primaryPduName = primaryPdu.pdu.name
    }
  }

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
          text: this.primaryPduName,
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        text: `Select any locations ${this.presenter.details.personName} can attend. You can skip this question if you do not know.`,
      },
      items: this.deliveryLocations,
    }
  }

  private radioArgs(): RadiosArgs {
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
