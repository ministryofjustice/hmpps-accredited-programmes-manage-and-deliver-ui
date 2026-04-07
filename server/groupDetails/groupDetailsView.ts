import GroupDetailsPresenter from './groupDetailsPresenter'
import { SummaryListArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'
import { MojAlertComponentArgs } from '../interfaces/alertComponentArgs'

export default class GroupDetailsView {
  constructor(private readonly presenter: GroupDetailsPresenter) {}

  get groupCodeSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.getGroupCodeSummary()),
    }
  }

  get groupTimingsSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.getGroupTimingsSummary()),
    }
  }

  get groupParticipantsSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.getGroupParticipantsSummary()),
    }
  }

  get groupLocationSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.getGroupLocationSummary()),
    }
  }

  get groupStaffSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.getGroupStaffSummary()),
    }
  }

  get successMessageSummary(): MojAlertComponentArgs | null {
    if (!this.presenter.successMessage) return null

    return {
      title: 'Success',
      html: this.presenter.successMessage,
      variant: 'success',
      dismissible: true,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'groupDetails/groupDetails',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        serviceNavigationArgs: this.presenter.getMojSubNavigationArgs(),
        groupCodeSummary: this.groupCodeSummary,
        groupTimingsSummary: this.groupTimingsSummary,
        groupParticipantsSummary: this.groupParticipantsSummary,
        groupLocationSummary: this.groupLocationSummary,
        groupStaffSummary: this.groupStaffSummary,
        sessionsAndAttendanceLink: this.presenter.sessionsAndAttendanceLink,
        successMessageSummary: this.successMessageSummary,
      },
    ]
  }
}
