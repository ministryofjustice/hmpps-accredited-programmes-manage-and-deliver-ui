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
  items: { text: string; value: string }[]
}
export default class AdditionalPdusView {
  private readonly pduCheckboxArgs: CheckboxArgs[]

  constructor(private readonly presenter: AdditionalPdusPresenter) {
    this.pduCheckboxArgs = this.pduToCheckboxArgs(presenter.pdus)
  }

  private previousValueArgs() {
    const selectedPrimaryPdus = this.presenter.currentFormData.updatePreferredLocationData.preferredDeliveryLocations
    if (!selectedPrimaryPdus[0].deliveryLocations || selectedPrimaryPdus[0].deliveryLocations.length === 0) {
      return {
        html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">East Sussex</p><p class="govuk-body">No information added</p>`,
      }
    }
    return {
      html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">East Sussex</p>${[]
        .concat(selectedPrimaryPdus[0].deliveryLocations)
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
      items: offices.map(({ label, value }) => ({ text: label, value })),
    }))
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'locationPreferences/additionalPdus',
      {
        presenter: this.presenter,
        previousValueArgs: this.previousValueArgs(),
        pduCheckboxArgs: this.pduCheckboxArgs,
        cancelLink: `/referral-details/${this.presenter.id}/location/#location`,
      },
    ]
  }
}
