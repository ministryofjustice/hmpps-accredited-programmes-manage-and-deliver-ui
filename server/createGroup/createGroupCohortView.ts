import { RadiosArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import CreateGroupCohortPresenter from './createGroupCohortPresenter'

export default class CreateGroupCohortView {
  constructor(private readonly presenter: CreateGroupCohortPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private radioArgs(): RadiosArgs {
    return {
      name: 'create-group-cohort',
      fieldset: {
        legend: {
          text: 'Select the group cohort',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        text: 'For Building Choices, general offence cohorts include domestic abuse cohorts.',
      },
      items: [
        {
          value: 'GENERAL_OFFENCE',
          text: 'General offence',
        },
        {
          value: 'GENERAL_OFFENCE_LDC',
          text: 'General offence, learning disabilities and challenges (LDC)',
        },
        {
          value: 'SEXUAL_OFFENCE_LDC',
          text: 'Sexual offence',
        },
        {
          value: 'SEXUAL_OFFENCE_LDC',
          text: 'Sexual offence, learning disabilities and challenges (LDC)',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupCohort.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupCohort',
      {
        presenter: this.presenter,
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        radioArgs: this.radioArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
