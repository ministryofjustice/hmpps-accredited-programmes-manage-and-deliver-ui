import MotivationBackgroundAndNonAssociationsPresenter from './motivationBackgroundAndNonAssociationsPresenter'
import { ButtonArgs } from '../../utils/govukFrontendTypes'

export default class MotivationBackgroundAndNonAssociationsView {
  constructor(private readonly presenter: MotivationBackgroundAndNonAssociationsPresenter) {}

  get addNotesButtonArgs(): ButtonArgs {
    return {
      text: 'Add notes',
      href: '',
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
      },
    ]
  }
}
