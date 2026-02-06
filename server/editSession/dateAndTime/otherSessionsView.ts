import ViewUtils from '../../utils/viewUtils'
import { RadiosArgs, SummaryListArgs } from '../../utils/govukFrontendTypes'
import OtherSessionsPresenter from './otherSessionsPresenter'

export default class OtherSessionsView {
  constructor(private readonly presenter: OtherSessionsPresenter) {}

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
        html: `<p class="govuk-hint">You are updating one session. The service can automatically move group sessions scheduled to take place after this session to reflect the changes you have made.</p>
               <p class="govuk-hint">Any scheduled one-to-one and catch-up sessions will not be moved.</p>`,
      },
      items: [
        {
          value: 'true',
          text: 'Yes, automatically move sessions to the next scheduled date',
          checked: this.presenter.fields.rescheduleOtherSessions.value === true,
        },
        {
          value: 'false',
          text: 'No, I will manually move sessions',
          checked: this.presenter.fields.rescheduleOtherSessions.value === false,
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
