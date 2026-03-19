import AttendanceHistoryPresenter from './attendanceHistoryPresenter'

export default class AttendanceHistoryView {
  constructor(private readonly presenter: AttendanceHistoryPresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'attendanceHistory/attendanceHistory',
      {
        presenter: this.presenter,
        headingText: this.presenter.headingText,
      },
    ]
  }
}
