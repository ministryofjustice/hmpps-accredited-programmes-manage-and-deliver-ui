import ChangeCohortPresenter from './changeCohortPresenter'
import { InsetTextArgs } from '../utils/govukFrontendTypes'
import { formatCohort } from '../utils/utils'

export default class ChangeCohortView {
  constructor(private readonly presenter: ChangeCohortPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'referralDetails/cohort/changeCohort',
      {
        presenter: this.presenter,
        currentCohortText: this.currentCohortText,
        radioArgs: this.radioArgs.bind(this),
        backLinkArgs: this.backLinkArgs(),
        backlinkUri: this.presenter.backlinkUri,
      },
    ]
  }

  get currentCohortText(): InsetTextArgs {
    return {
      html: `<p> ${this.presenter.details.personName}'s, current cohort: </p>
        <p class="govuk-!-font-weight-bold">${formatCohort(this.presenter.details.cohort)}</p>`,

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
      name: 'updatedCohort',
      fieldset: {
        legend: {
          text: 'Select the new cohort',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'SEXUAL_OFFENCE',
          text: 'Sexual offence',
        },
        {
          value: 'GENERAL_OFFENCE',
          text: 'General offence',
        },
      ],

      value: this.presenter.fields.updatedCohort.value,
    }
  }
}
