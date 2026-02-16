import { SelectArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateGroupPduPresenter from './groupCreatePduPresenter'

export default class CreateGroupPduView {
  constructor(private readonly presenter: CreateGroupPduPresenter) {}

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

  private createGroupPduArgs(): SelectArgs {
    return {
      id: 'create-group-pdu',
      name: 'create-group-pdu',
      label: {
        text: 'In which probation delivery unit (PDU) will the group take place?',
        classes: 'govuk-label--l',
        isPageHeading: true,
      },
      hint: {
        text: 'Search for PDU',
        classes: 'govuk-label--m govuk-label govuk-!-margin-top-6',
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupPdu.errorMessage),
      items: this.presenter.generateSelectOptions(),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupCreate/groupCreatePdu',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupPduArgs: this.createGroupPduArgs(),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
      },
    ]
  }
}
