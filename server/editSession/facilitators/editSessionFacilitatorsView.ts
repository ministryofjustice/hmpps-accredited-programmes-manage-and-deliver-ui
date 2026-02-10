import { EditSessionFacilitatorsRequest } from '@manage-and-deliver-api'
import { FieldsetArgs, SelectArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
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

  private editSessionFacilitatorsArgs(): SelectArgs {
    return {
      id: 'edit-session-facilitator',
      name: 'edit-session-facilitator',
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.editSessionFacilitator.errorMessage),
      items: this.presenter.generateSelectOptions(),
    }
  }

  private editExistingSessionFacilitatorArgs(facilitator: EditSessionFacilitatorsRequest, index: number): SelectArgs {
    return {
      id: `edit-session-facilitator-existing-${index}`,
      name: `edit-session-facilitator-existing-${index}`,
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.editSessionFacilitator.errorMessage),
      items: this.presenter.generateSelectOptions(facilitator.facilitatorCode),
    }
  }

  private editSessionFacilitatorsFieldSetArgs(): FieldsetArgs {
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
        editSesssionFacilitatorArgs: this.editSessionFacilitatorsArgs(),
        editSessionFacilitatorsFieldSetArgs: this.editSessionFacilitatorsFieldSetArgs(),
        editExistingSessionFacilitatorArgs: this.editExistingSessionFacilitatorArgs.bind(this),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        facilitators: this.presenter.generateSelectedUsers().facilitators,
      },
    ]
  }
}
