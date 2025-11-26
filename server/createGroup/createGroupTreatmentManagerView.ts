import { SelectArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import CreateGroupPduPresenter from './createGroupPduPresenter'
import CreateGroupTreatmentManagerPresenter from './createGroupTreatmentManagerPresenter'

export default class CreateGroupTreatmentManagerView {
  constructor(private readonly presenter: CreateGroupTreatmentManagerPresenter) {}

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

  private createGroupTreatmentManagerArgs(): SelectArgs {
    return {
      id: 'create-group-treatment-manager',
      name: 'create-group-treatment-manager',
      label: {
        text: 'Treatment Manager',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupTreatmentManager.errorMessage),
      items: this.presenter.generateSelectOptions(),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupTreatmentManager',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupTreatmentManagerArgs: this.createGroupTreatmentManagerArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
