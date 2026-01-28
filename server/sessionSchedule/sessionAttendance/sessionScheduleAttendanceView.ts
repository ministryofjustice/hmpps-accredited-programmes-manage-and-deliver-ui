import SessionScheduleAttendancePresenter from './sessionScheduleAttendancePresenter'

export default class SessionScheduleAttendanceView {
  constructor(private readonly presenter: SessionScheduleAttendancePresenter) {}

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/sessionAttendance',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        sessionAttendanceAccordionArgs: {
          id: 'sessions-accordion',
          headingLevel: 2,
          items: this.presenter.getAccordionItems(),
        },
        serviceNavigationArgs: this.presenter.getServiceNavigationArgs(),
      },
    ]
  }
}
