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

  private createGroupCohortArgs(): RadiosArgs {
    return {
      name: 'create-group-cohort',
      fieldset: {
        legend: {
          text: this.presenter.pageHeading,
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
        pageTitle: this.presenter.pageTitle,
        // pageHeading: this.presenter.pageHeading,
        captionText: this.presenter.captionText,
        createGroupCohortArgs: this.createGroupCohortArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        submitButtonText: this.presenter.submitButtonText,
      },
    ]
  }
}
