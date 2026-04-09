import ViewUtils from '../../utils/viewUtils'
import { RadiosArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import RescheduleSessionsPresenter from './rescheduleSessionPresenter'

export default class RescheduleSessionsView {
  constructor(private readonly presenter: RescheduleSessionsPresenter) {}

  private backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private get sessionDateAndTimesSummary(): SummaryListArgs {
    return {
      ...ViewUtils.summaryListArgs(this.presenter.sessionDateAndTimesSummary),
    }
  }

  private get radioArgs(): RadiosArgs {
    return {
      name: 'reschedule-other-sessions',
      fieldset: {
        legend: {
          text: 'Automatically reschedule other sessions?',
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      hint: {
        html: `<p class="govuk-hint">You are updating the group overview details. The service can automatically move all scheduled group sessions to reflect the changes you have made.</p> <p class="govuk-hint">Any scheduled one-to-one sessions will not be moved.</p>`,
      },
      items: [
        {
          value: 'true',
          text: 'Yes, automatically update group sessions to reflect these changes',
        },
        {
          value: 'false',
          text: 'No, I will manually move sessions',
        },
      ],
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'editSession/otherSessions',
      {
        backLinkArgs: this.backLinkArgs(),
        text: this.presenter.text,
        radioArgs: this.radioArgs,
        sessionDateAndTimesSummary: this.sessionDateAndTimesSummary,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
