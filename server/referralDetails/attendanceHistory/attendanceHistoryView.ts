import AttendanceHistoryPresenter from './attendanceHistoryPresenter'
import { InsetTextArgs, TableArgs } from '../../utils/govukFrontendTypes'

export default class AttendanceHistoryView {
  constructor(private readonly presenter: AttendanceHistoryPresenter) {}

  get backLinkArgs() {
    return {
      text: 'Back',
      href: `/region/referrals/${this.presenter.referralId}`,
    }
  }

  get groupTableArgs(): TableArgs {
    return {
      caption: 'Attendance record and session notes',
      captionClasses: 'govuk-visually-hidden',
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      head: [
        {
          text: 'Session',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Group code',
        },
        {
          text: 'Date',
          attributes: {
            'aria-sort': 'none',
          },
        },
        {
          text: 'Time',
        },
        {
          text: 'Attendance status',
        },
        {
          text: 'Attendance and notes',
        },
      ],
      rows: this.presenter.attendanceHistoryTableArgs,
    }
  }

  get insetText(): InsetTextArgs {
    return {
      text: `${this.presenter.attendanceHistory.popName}’s referral has been transferred from Interventions Manager. For attendance history before the transfer, view NDelius.`,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'attendanceHistory/attendanceHistory',
      {
        presenter: this.presenter,
        pageTitle: this.presenter.pageTitle,
        text: this.presenter.text,
        errorSummary: this.presenter.errorMessageSummary,
        successMessageSummary: this.presenter.successMessageSummary,
        groupTableArgs: this.groupTableArgs,
        showAttendanceHistoryTable: this.presenter.attendanceHistory.attendanceHistory.length > 0,
        isTransferredFromIM: this.presenter.isTransferredFromIM,
        insetText: this.insetText,
      },
    ]
  }
}
