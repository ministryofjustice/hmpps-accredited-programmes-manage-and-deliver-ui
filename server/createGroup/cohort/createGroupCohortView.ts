import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupCohortPresenter from './createGroupCohortPresenter'
import CreateGroupUtils from '../createGroupUtils'

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
      items: new CreateGroupUtils().programmeGroupCohortEnum.map(option => ({
        value: option.value,
        text: option.text,
        checked: this.presenter.fields.createGroupCohort.value === option.value,
      })),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupCohort.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupCohort',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        radioArgs: this.radioArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
