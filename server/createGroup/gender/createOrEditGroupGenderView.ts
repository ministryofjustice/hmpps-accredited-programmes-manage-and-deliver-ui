import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupSexPresenter from './createOrEditGroupGenderPresenter'
import CreateGroupUtils from '../createGroupUtils'

export default class CreateGroupSexView {
  constructor(private readonly presenter: CreateGroupSexPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private createGroupSexArgs(): RadiosArgs {
    return {
      name: 'create-group-sex',
      fieldset: {
        legend: {
          text: this.presenter.pageHeading,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      items: new CreateGroupUtils().programmeGroupSexEnum.map(option => ({
        value: option.value,
        text: option.text,
        checked: this.presenter.fields.createOrEditGroupGender.value === option.value,
      })),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createOrEditGroupGender.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupGender',
      {
        backLinkArgs: this.backLinkArgs(),
        pageTitle: this.presenter.pageTitle,
        captionText: this.presenter.captionText,
        createGroupSexArgs: this.createGroupSexArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        submitButtonText: this.presenter.submitButtonText,
      },
    ]
  }
}
