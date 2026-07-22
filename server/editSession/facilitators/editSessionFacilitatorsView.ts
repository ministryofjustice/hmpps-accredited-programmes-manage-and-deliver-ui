import { EditSessionFacilitatorsRequest } from '@manage-and-deliver-api'
import { SelectArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import EditSessionFacilitatorsPresenter from './editSessionFacilitatorsPresenter'

export default class EditSessionFacilitatorsView {
  constructor(private readonly presenter: EditSessionFacilitatorsPresenter) {}

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private editSessionFacilitatorsArgs(): SelectArgs {
    return {
      id: 'edit-session-facilitator-0',
      name: 'edit-session-facilitator-0',
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessageForField('edit-session-facilitator-0')),
      items: this.presenter.generateSelectOptions(),
    }
  }

  private editExistingSessionFacilitatorArgs(facilitator: EditSessionFacilitatorsRequest, index: number): SelectArgs {
    const fieldName = `edit-session-facilitator-${index}`
    return {
      id: fieldName,
      name: fieldName,
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessageForField(fieldName)),
      items: this.presenter.generateSelectOptions(facilitator.facilitatorCode),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/editSessionFacilitators',
      {
        backLinkArgs: this.presenter.backLinkArgs,
        pageTitles: this.presenter.pageTitles,
        homePageLink: this.homePageLink(),
        editSessionFacilitatorsArgs: this.editSessionFacilitatorsArgs(),
        editExistingSessionFacilitatorsArgs: this.editExistingSessionFacilitatorArgs.bind(this),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        facilitators: this.presenter.generateSelectedUsers().facilitators,
      },
    ]
  }
}
