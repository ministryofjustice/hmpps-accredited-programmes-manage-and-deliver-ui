import { InsetTextArgs } from '../utils/govukFrontendTypes'
import GroupAllocationNotesPresenter from './groupAllocationNotesPresenter'

export default class GroupAllocationNotesView {
  constructor(private readonly presenter: GroupAllocationNotesPresenter) {}

  private get groupAllocationTextArgs(): InsetTextArgs {
    return {
      html: `<p> ${this.presenter.referral.personName} is allocated to <a href="/groupDetails/${this.presenter.referral.currentlyAllocatedGroupId}/waitlist">
            ${this.presenter.referral.currentlyAllocatedGroupCode}</a></p>`,
      classes: 'govuk-!-margin-top-0',
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupAllocationNotes/groupAllocationNotes',
      {
        presenter: this.presenter,
        groupAllocationTextArgs: this.groupAllocationTextArgs,
      },
    ]
  }
}
