import MotivationBackgroundAndNonAssociationsPresenter from './motivationBackgroundAndNonAssociationsPresenter'
import { ButtonArgs, InsetTextArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import ViewUtils from '../../utils/viewUtils'

export default class MotivationBackgroundAndNonAssociationsView {
  constructor(private readonly presenter: MotivationBackgroundAndNonAssociationsPresenter) {}

  get addNotesButtonArgs(): ButtonArgs {
    return {
      text: this.presenter.motivationBackgroundAndNonAssociations.id ? 'Update notes' : 'Add notes',
      href: `/referral/${this.presenter.referral.id}/add-motivation-background-and-non-associations`,
    }
  }

  get lastUpdatedInsetText(): InsetTextArgs {
    return this.presenter.motivationBackgroundAndNonAssociations.id
      ? {
          text: `Last updated by ${this.presenter.lastUpdatedBy} on ${this.presenter.lastUpdatedAt}`,
          classes: 'govuk-!-margin-top-0',
        }
      : null
  }

  get motivationBackgroundAndNonAssociationsSummaryListArgs(): SummaryListArgs {
    return this.presenter.motivationBackgroundAndNonAssociations.id
      ? {
          ...ViewUtils.summaryListArgs(this.presenter.motivationBackgroundAndNonAssociationsSummaryListItems),
        }
      : null
  }

  private get successMessageArgs() {
    return {
      variant: 'success',
      title: 'Motivation, background and non-associations details added.',
      showTitleAsHeading: true,
      dismissible: true,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupAllocationNotes/groupAllocationNotes',
      {
        presenter: this.presenter,
        groupAllocationTextArgs: this.presenter.groupAllocationTextArgs,
        getVerticalSubNavArgs: this.presenter.getVerticalSubNavArgs(),
        addNotesButtonArgs: this.addNotesButtonArgs,
        motivationBackgroundAndNonAssociationsSummaryListArgs:
          this.motivationBackgroundAndNonAssociationsSummaryListArgs,
        lastUpdatedInsetText: this.lastUpdatedInsetText,
        hasNotesSaved: this.presenter.motivationBackgroundAndNonAssociations.id !== null,
        successMessageArgs: this.successMessageArgs,
        isNotesUpdated: this.presenter.isMotivationsUpdated,
      },
    ]
  }
}
