import { InsetTextArgs } from '../utils/govukFrontendTypes'
import UpdateLdcPresenter from './updateLdcPresenter'

export default class UpdateLdcView {
  constructor(private readonly presenter: UpdateLdcPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/ldc/updateLdc',
      {
        presenter: this.presenter,
        currentLdcStatusText: this.currentLdcStatusText,
        radioArgs: this.radioArgs.bind(this),
        backLinkArgs: this.backLinkArgs(),
        backlinkUri: this.presenter.backlinkUri,
      },
    ]
  }

  get currentLdcStatusText(): InsetTextArgs {
    return {
      html: `<p> ${this.presenter.details.personName}'s current LDC status:</p>
        <p class="govuk-!-font-weight-bold">${this.presenter.details.hasLdcDisplayText}</p>`,

      classes: 'govuk-!-margin-top-0',
    }
  }

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backlinkUri,
    }
  }

  private radioArgs() {
    return {
      name: 'hasLdc',
      fieldset: {
        legend: {
          text: 'Select the new LDC status',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'true',
          text: 'May need an LDC-adapted programme(Building Choices Plus)',
        },
        {
          value: 'false',
          text: 'Does not need an LDC-adapted programme',
        },
      ],
      value: this.presenter.fields.hasLdc.value.toString(),
    }
  }
}
