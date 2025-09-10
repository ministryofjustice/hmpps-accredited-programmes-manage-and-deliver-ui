import AdditionalPdusPresenter from './additionalPdusPresenter'

export default class AdditionalPdusView {
  constructor(private readonly presenter: AdditionalPdusPresenter) {}

  private previousValueArgs() {
    if (!this.presenter.currentFormData.pdus || this.presenter.currentFormData.pdus.length === 0) {
      return {
        html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">East Sussex</p><p class="govuk-body">No information added</p>`,
      }
    }
    return {
      html: `<p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">East Sussex</p>${[]
        .concat(this.presenter.currentFormData.pdus)
        .map(pdu => `<p class="govuk-!-margin-0">${pdu}</p>`)
        .join('')}`,
    }
  }

  private checkboxArgs1() {
    return {
      name: 'pdu-location-2',
      fieldset: {
        legend: {
          text: 'East Kent',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'Canterbury: Ralphs Centre',
          text: 'Canterbury: Ralphs Centre',
        },
        {
          value: 'Kent: Maidstone Probation Office',
          text: 'Kent: Maidstone Probation Office',
        },
        {
          value: 'Medway: Chatham Probation Office',
          text: 'Medway: Chatham Probation Office',
        },
        {
          value: 'Shepway: Folkestone Probation Office',
          text: 'Shepway: Folkestone Probation Office',
        },
      ],
    }
  }

  private checkboxArgs2() {
    return {
      name: 'pdu-locations-1',
      fieldset: {
        legend: {
          text: 'Surrey',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'Croydon: 4 Whitgift Street',
          text: 'Croydon: 4 Whitgift Street',
        },
        {
          value: 'Guildford: College House',
          text: 'Guildford: College House',
        },
        {
          value: 'Spelthorne: Swan House',
          text: 'Spelthorne: Swan House',
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'locationPreferences/additionalPdus',
      {
        presenter: this.presenter,
        previousValueArgs: this.previousValueArgs(),
        checkboxArgs2: this.checkboxArgs2(),
        checkboxArgs1: this.checkboxArgs1(),
        cancelLink: `/referral-details/${this.presenter.id}/location/#location`,
      },
    ]
  }
}
