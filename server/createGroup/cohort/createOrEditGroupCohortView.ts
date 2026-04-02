import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupCohortPresenter from './createOrEditGroupCohortPresenter'
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

  private createGroupCohortArgs(): RadiosArgs {
    return {
      name: 'create-group-cohort',
      fieldset: {
        legend: {
          text: this.presenter.pageTitle,
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
        checked: this.presenter.fields.createOrEditGroupCohort.value === option.value,
      })),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createOrEditGroupCohort.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupCohort',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        captionText: this.presenter.captionText,
        createGroupCohortArgs: this.createGroupCohortArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        submitButtonText: this.presenter.submitButtonText,
      },
    ]
  }
}
