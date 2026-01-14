import ViewUtils from '../../utils/viewUtils'
import SessionScheduleAttendancePresenter from './sessionScheduleAttendancePresenter'

export default class SessionScheduleAttendanceView {
  constructor(private readonly presenter: SessionScheduleAttendancePresenter) {}

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

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/sessionAttendance',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        presenter: this.presenter,
        sessionAttendanceaccordionArgs: {
          id: 'sessions-accordion',
          headingLevel: 2,
          items: this.presenter.getAccordionItems(),
        },
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
