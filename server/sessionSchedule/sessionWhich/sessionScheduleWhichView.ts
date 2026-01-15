import { RadiosArgs } from '../../utils/govukFrontendTypes'
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

  private homePageLink() {
    return {
      text: 'Go to Accredited Programmes homepage',
      href: `/`,
    }
  }

  private radioArgs(): RadiosArgs {
    const { sessionTemplates } = this.presenter

    return {
      name: 'session-template',
      fieldset: {
        legend: {
          text: 'Which session are you scheduling?',
          isPageHeading: true,
          classes: 'govuk-fieldset__legend--l',
        },
      },
      hint: this.presenter.text.headingHintText
        ? {
            text: this.presenter.text.headingHintText,
          }
        : undefined,
      items: sessionTemplates.map(template => ({
        value: template.id,
        text: template.name,
        checked: this.presenter.fields.sessionTemplate.value === template.id,
      })),
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields.sessionTemplate.errorMessage),
    }
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'sessionSchedule/sessionScheduleWhich',
      {
        backLinkArgs: this.backLinkArgs(),
        homePageLink: this.homePageLink(),
        radioArgs: this.radioArgs(),
        text: this.presenter.text,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
