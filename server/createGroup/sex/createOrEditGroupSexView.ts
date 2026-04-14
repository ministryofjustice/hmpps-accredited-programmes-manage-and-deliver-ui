import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupSexPresenter from './createOrEditGroupSexPresenter'
import CreateGroupUtils from '../createGroupUtils'

export default class CreateGroupSexView {
  constructor(private readonly presenter: CreateGroupSexPresenter) {}

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

  private createGroupSexArgs(): RadiosArgs {
    return {
      name: 'create-group-sex',
      fieldset: {
        legend: {
          text: this.presenter.pageTitle,
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      items: new CreateGroupUtils().programmeGroupSexEnum.map(option => ({
        value: option.value,
        text: option.text,
        checked: this.presenter.fields.createOrEditGroupSex.value === option.value,
      })),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createOrEditGroupSex.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupSex',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        captionText: this.presenter.captionText,
        createGroupSexArgs: this.createGroupSexArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        submitButtonText: this.presenter.submitButtonText,
      },
    ]
  }
}
