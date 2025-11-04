import { RadiosArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import CreateGroupSexPresenter from './createGroupSexPresenter'

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
          text: 'Select the group sex',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: {
        text: 'For Building Choices, general offence cohorts include domestic abuse cohorts.',
      },
      items: [
        {
          value: 'MALE',
          text: 'Male',
        },
        {
          value: 'FEMALE',
          text: 'Female',
        },
        {
          value: 'MIXED',
          text: 'Mixed',
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupSex.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupSex',
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
