import { RadiosArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupSexPresenter from './createGroupSexPresenter'
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

  private radioArgs(): RadiosArgs {
    return {
      name: 'create-group-sex',
      fieldset: {
        legend: {
          text: 'Select the sex of the group',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      items: new CreateGroupUtils().programmeGroupSexEnum.map(option => ({
        value: option.value,
        text: option.text,
        checked: this.presenter.fields.createGroupSex.value === option.value,
      })),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupSex.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupSex',
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
