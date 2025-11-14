import { ButtonArgs } from '../../utils/govukFrontendTypes'
import AddMotivationBackgroundAndNonAssociationsNotesPresenter from './addMotivationBackgroundAndNonAssociationsNotesPresenter'
import ViewUtils from '../../utils/viewUtils'

export default class AddMotivationBackgroundAndNonAssociationsNotesView {
  constructor(private readonly presenter: AddMotivationBackgroundAndNonAssociationsNotesPresenter) {}

  private get maintainsInnocenceRadioArgs() {
    return {
      name: 'maintains-innocence',
      fieldset: {
        legend: {
          text: 'Does the person maintain their innocence?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items: [
        {
          value: 'yes',
          text: 'Yes',
          checked: this.presenter.fields.maintainInnocence.value === true,
        },
        {
          value: 'no',
          text: 'No',
          checked: this.presenter.fields.maintainInnocence.value === false,
        },
      ],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.maintainInnocence.errorMessage),
    }
  }

  private get motivatedCharacterCountArgs() {
    return {
      name: 'motivated-character-count',
      id: 'motivated-character-count',
      maxlength: '2000',
      label: {
        text: this.presenter.text.motivatedCharacterCount.label,
        classes: 'govuk-label govuk-label--m',
      },
      hint: {
        text: this.presenter.text.motivatedCharacterCount.hint,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.motivated.errorMessage),
      value: this.presenter.fields.motivated.value,
    }
  }

  private get nonAssociationsCharacterCountArgs() {
    return {
      name: 'non-associations-character-count',
      id: 'non-associations-character-count',
      maxlength: '2000',
      label: {
        text: this.presenter.text.otherPeopleCharacterCount.label,
        classes: 'govuk-label govuk-label--m',
      },
      hint: {
        text: this.presenter.text.otherPeopleCharacterCount.hint,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.nonAssociations.errorMessage),
      value: this.presenter.fields.nonAssociations.value,
    }
  }

  private get otherConsiderationsCountArgs() {
    return {
      name: 'other-considerations-character-count',
      id: 'other-considerations-character-count',
      maxlength: '2000',
      label: {
        text: this.presenter.text.otherConsiderationsCharacterCount.label,
        classes: 'govuk-label govuk-label--m',
      },
      hint: {
        text: this.presenter.text.otherConsiderationsCharacterCount.hint,
      },
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.otherConsiderations.errorMessage),
      value: this.presenter.fields.otherConsiderations.value,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupAllocationNotes/addMotivationBackgroundAndNonAssociations/addMotivationBackgroundAndNonAssociationsNotes',
      {
        presenter: this.presenter,
        maintainsInnocenceRadioArgs: this.maintainsInnocenceRadioArgs,
        motivatedCharacterCountArgs: this.motivatedCharacterCountArgs,
        nonAssociationsCharacterCountArgs: this.nonAssociationsCharacterCountArgs,
        otherConsiderationsCountArgs: this.otherConsiderationsCountArgs,
        formActionLink: this.presenter.formActionLink,
        cancelLink: '/',
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
