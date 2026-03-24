import AttendanceHistoryPresenter from './attendanceHistoryPresenter'
import { TableArgs } from '../../utils/govukFrontendTypes'

export default class AttendanceHistoryView {
  constructor(private readonly presenter: AttendanceHistoryPresenter) {}

  get backLinkArgs() {
    return {
      text: 'Back',
      href: `/pdu/referrals/${this.presenter.referralId}`,
    }
  }

  get groupTableArgs(): TableArgs {
    return {
      attributes: {
        'data-module': 'moj-sortable-table',
      },
      head: [
        {
          text: 'Session',
          attributes: {
            'aria-sort': 'ascending',
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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'attendanceHistory/attendanceHistory',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        errorSummary: this.presenter.errorMessageSummary,
        successMessageSummary: this.presenter.successMessageSummary,
        groupTableArgs: this.groupTableArgs,
        showAttendanceHistoryTable: this.presenter.attendanceHistory.attendanceHistory.length > 0,
      },
    ]
  }
}
