import AdditionalPdusPresenter from './additionalPdusPresenter'

interface CheckboxArgs {
  name: string
  fieldset: {
    legend: {
      text: string
      isPageHeading: false
      classes: 'govuk-fieldset__legend--m'
    }
  }
  items: { text: string; value: string; checked: boolean }[]
}
export default class AdditionalPdusView {
  private readonly pduCheckboxArgs: CheckboxArgs[]

  constructor(private readonly presenter: AdditionalPdusPresenter) {
    this.pduCheckboxArgs = this.pduToCheckboxArgs(presenter.pdus)
  }

  private previousValueArgs() {
    const selectedPrimaryPdus = this.presenter.currentFormData.preferredDeliveryLocations[0]
    if (!selectedPrimaryPdus.deliveryLocations || selectedPrimaryPdus.deliveryLocations.length === 0) {
      return {
        html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">${selectedPrimaryPdus.pduDescription}</p><p class="govuk-body">No information added</p>`,
      }
    }
    return {
      html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">${selectedPrimaryPdus.pduDescription}</p>${[]
        .concat(selectedPrimaryPdus.deliveryLocations)
        .map(pdu => `<p class="govuk-!-margin-0">${pdu.description}</p>`)
        .join('')}`,
    }
  }

  private pduToCheckboxArgs(pdus: AdditionalPdusPresenter['pdus']): CheckboxArgs[] {
    return pdus.map(({ offices, code, name }) => ({
      name: code,
      fieldset: {
        legend: {
          text: name,
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: this.generateCheckboxes(offices),
    }))
  }

  generateCheckboxes(offices: { value: string; label: string }[]) {
    const selectedValues = this.presenter.preferredLocationReferenceData.existingDeliveryLocationPreferences
      ? this.presenter.preferredLocationReferenceData.existingDeliveryLocationPreferences.canAttendLocationsValues.map(
          item => item.value,
        )
      : []
    let deliveryLocations = offices.map(({ label, value }) => ({ text: label, value, checked: false }))
    deliveryLocations = deliveryLocations.map(location => ({
      ...location,
      checked: selectedValues.includes(location.value),
    }))
    return deliveryLocations
  }

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'locationPreferences/additionalPdus',
      {
        presenter: this.presenter,
        previousValueArgs: this.previousValueArgs(),
        pduCheckboxArgs: this.pduCheckboxArgs,
        cancelLink: `/referral-details/${this.presenter.referralId}/location/#location`,
        backLinkArgs: this.backLinkArgs(),
      },
    ]
  }
}
