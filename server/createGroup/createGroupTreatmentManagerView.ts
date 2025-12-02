import { CreateGroupTeamMember } from '@manage-and-deliver-api'
import { FieldsetArgs, SelectArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
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
        classes: 'govuk-label--m',
        isPageHeading: true,
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
      id: 'create-group-facilitator',
      name: 'create-group-facilitator',
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupFacilitator.errorMessage),
      items: this.presenter.generateSelectOptions('REGULAR_FACILITATOR'),
    }
  }

  private createExistingGroupFacilitatorArgs(facilitator: CreateGroupTeamMember, index: number): SelectArgs {
    return {
      id: `create-group-facilitator-existing-${index}`,
      name: `create-group-facilitator-existing-${index}`,
      label: {
        text: 'Facilitator',
        classes: 'govuk-label--m',
      },
      classes: 'add-facilitator-select',
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.createGroupFacilitator.errorMessage),
      items: this.presenter.generateSelectOptions('REGULAR_FACILITATOR', facilitator.facilitatorCode),
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

  private createGroupCoverFacilitatorArgs(): SelectArgs {
    return {
      id: 'create-group-cover-facilitator',
      name: 'create-group-cover-facilitator',
      label: {
        text: 'Cover facilitator (optional)',
        classes: 'govuk-label--m',
      },
      classes: 'add-cover-facilitator-select',
      items: this.presenter.generateSelectOptions('COVER_FACILITATOR'),
    }
  }

  private createExistingGroupCoverFacilitatorArgs(facilitator: CreateGroupTeamMember, index: number): SelectArgs {
    return {
      id: `create-group-cover-facilitator-existing-${index}`,
      name: `create-group-cover-facilitator-existing-${index}`,
      label: {
        text: 'Cover facilitator (optional)',
        classes: 'govuk-label--m',
      },
      classes: 'add-cover-facilitator-select',
      items: this.presenter.generateSelectOptions('COVER_FACILITATOR', facilitator.facilitatorCode),
    }
  }

  private createGroupCoverFacilitatorsFieldSetArgs(): FieldsetArgs {
    return {
      classes: 'moj-add-another__item moj-add-another__item__cover-facilitator',
      legend: {
        text: 'Facilitator',
        classes: 'govuk-!-display-none',
        isPageHeading: false,
      },
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'createGroup/createGroupTreatmentManager',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        createGroupTreatmentManagerArgs: this.createGroupTreatmentManagerArgs(),
        createGroupFacilitatorArgs: this.createGroupFacilitatorArgs(),
        createGroupFacilitatorsFieldSetArgs: this.createGroupFacilitatorsFieldSetArgs(),
        createExistingGroupFacilitatorArgs: this.createExistingGroupFacilitatorArgs.bind(this),
        createGroupCoverFacilitatorArgs: this.createGroupCoverFacilitatorArgs(),
        createGroupCoverFacilitatorsFieldSetArgs: this.createGroupCoverFacilitatorsFieldSetArgs(),
        createExistingGroupCoverFacilitatorArgs: this.createExistingGroupCoverFacilitatorArgs.bind(this),
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
        text: this.presenter.text,
        facilitators: this.presenter.generateSelectedUsers().facilitators,
        coverFacilitators: this.presenter.generateSelectedUsers().coverFacilitators,
      },
    ]
  }
}
