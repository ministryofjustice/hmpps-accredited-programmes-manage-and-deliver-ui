import ViewUtils from '../../utils/viewUtils'
import SessionScheduleWhichPresenter from './sessionScheduleWhichPresenter'

export default class SessionScheduleWhichView {
  constructor(private readonly presenter: SessionScheduleWhichPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/sessionScheduleWhich',
      {
        backLinkArgs: this.backLinkArgs(),
        pageTitle: this.presenter.pageTitle,
        sessionTemplates: this.presenter.sessionTemplates,
        selectedSessionTemplateId: this.presenter.selectedSessionTemplateId,
        selectedSession: this.presenter.fields.sessionTemplate.value,
        selectedSessionScheduleType: this.presenter.fields.sessionScheduleType.value,
        sessionTemplateErrorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.sessionTemplate.errorMessage),
        sessionScheduleTypeErrorMessage: this.presenter.fields.sessionScheduleType.errorMessage,
        text: this.presenter.text,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
