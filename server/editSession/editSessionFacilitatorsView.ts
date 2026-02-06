import { EditSessionFacilitator } from '@manage-and-deliver-api'
import { FieldsetArgs, SelectArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import EditSessionFacilitatorsPresenter from './editSessionFacilitatorsPresenter'

export default class EditSessionFacilitatorsView {
  constructor(private readonly presenter: EditSessionFacilitatorsPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkArgs,
    }
  }

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private createGroupFacilitatorArgs(): SelectArgs {
    return {
      id: 'create-group-facilitator',
      name: 'create-group-facilitator',
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.editSessionFacilitator.errorMessage),
      items: this.presenter.generateSelectOptions(),
    }
  }

  private createExistingGroupFacilitatorArgs(facilitator: EditSessionFacilitator, index: number): SelectArgs {
    return {
      id: `create-group-facilitator-existing-${index}`,
      name: `create-group-facilitator-existing-${index}`,
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.editSessionFacilitator.errorMessage),
      items: this.presenter.generateSelectOptions(facilitator.facilitatorCode),
    }
  }

  private createGroupFacilitatorsFieldSetArgs(): FieldsetArgs {
    return {
      classes: 'moj-add-another__item moj-add-another__item__facilitator',
      legend: {
        text: 'Facilitator',
        classes: 'govuk-!-display-none',
        isPageHeading: false,
      },
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/editSessionFacilitators',
      {
        backLinkArgs: this.presenter.backLinkArgs,
        homePageLink: this.homePageLink(),
        createGroupFacilitatorArgs: this.createGroupFacilitatorArgs(),
        createGroupFacilitatorsFieldSetArgs: this.createGroupFacilitatorsFieldSetArgs(),
        createExistingGroupFacilitatorArgs: this.createExistingGroupFacilitatorArgs.bind(this),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        facilitators: this.presenter.generateSelectedUsers().facilitators,
      },
    ]
  }
}
