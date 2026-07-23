import { CreateGroupTeamMember } from '@manage-and-deliver-api'
import { SelectArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'
import CreateOrEditGroupTreatmentManagerPresenter from './createOrEditGroupTreatmentManagerPresenter'

export default class CreateOrEditGroupTreatmentManagerView {
  constructor(private readonly presenter: CreateOrEditGroupTreatmentManagerPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private createGroupTreatmentManagerArgs(): SelectArgs {
    return {
      id: 'create-group-treatment-manager',
      name: 'create-group-treatment-manager',
      label: {
        // text: 'Treatment Manager',
        // classes: 'govuk-label--m',
        isPageHeading: false,
        html: `<h2 class="govuk-label govuk-label--m">Treatment Manager</h2>`,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupTreatmentManager.errorMessage),
      items: this.presenter.generateSelectOptions(
        'TREATMENT_MANAGER',
        this.presenter.fields.createGroupTreatmentManager.value,
      ),
    }
  }

  private createGroupFacilitatorArgs(): SelectArgs {
    return {
      id: 'create-group-facilitator-0',
      name: 'create-group-facilitator-0',
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessageForField('create-group-facilitator-0')),
      items: this.presenter.generateSelectOptions('REGULAR_FACILITATOR'),
    }
  }

  private createExistingGroupFacilitatorArgs(facilitator: CreateGroupTeamMember, index: number): SelectArgs {
    const fieldName = `create-group-facilitator-${index}`
    return {
      id: fieldName,
      name: fieldName,
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessageForField(fieldName)),
      items: this.presenter.generateSelectOptions('REGULAR_FACILITATOR', facilitator.facilitatorCode),
    }
  }

  private createGroupCoverFacilitatorArgs(): SelectArgs {
    return {
      id: 'create-group-cover-facilitator-0',
      name: 'create-group-cover-facilitator-0',
      label: {
        text: 'Cover facilitator (optional)',
        classes: 'govuk-label--m',
      },
      classes: 'add-cover-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(
        this.presenter.errorMessageForField('create-group-cover-facilitator-0'),
      ),
      items: this.presenter.generateSelectOptions('COVER_FACILITATOR'),
    }
  }

  private createExistingGroupCoverFacilitatorArgs(facilitator: CreateGroupTeamMember, index: number): SelectArgs {
    const fieldName = `create-group-cover-facilitator-${index}`
    return {
      id: fieldName,
      name: fieldName,
      label: {
        text: 'Cover facilitator (optional)',
        classes: 'govuk-label--m',
      },
      classes: 'add-cover-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.errorMessageForField(fieldName)),
      items: this.presenter.generateSelectOptions('COVER_FACILITATOR', facilitator.facilitatorCode),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupTreatmentManager',
      {
        backLinkArgs: this.backLinkArgs(),
        createGroupTreatmentManagerArgs: this.createGroupTreatmentManagerArgs(),
        createGroupFacilitatorArgs: this.createGroupFacilitatorArgs(),
        createExistingGroupFacilitatorArgs: this.createExistingGroupFacilitatorArgs.bind(this),
        createGroupCoverFacilitatorArgs: this.createGroupCoverFacilitatorArgs(),
        createExistingGroupCoverFacilitatorArgs: this.createExistingGroupCoverFacilitatorArgs.bind(this),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        pageTitle: this.presenter.pageTitle,
        pageHeading: this.presenter.pageHeading,
        isEditJourney: this.presenter.isEditJourney,
        submitButtonText: this.presenter.submitButtonText,
        captionText: this.presenter.captionText,
        facilitators: this.presenter.generateSelectedUsers().facilitators,
        coverFacilitators: this.presenter.generateSelectedUsers().coverFacilitators,
        insetText: this.presenter.insetText,
      },
    ]
  }
}
