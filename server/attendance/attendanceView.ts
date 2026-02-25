import AttendancePresenter from './attendancePresenter'
import { RadiosArgs } from '../utils/govukFrontendTypes'
import ViewUtils from '../utils/viewUtils'

export default class AttendanceView {
  constructor(private readonly presenter: AttendancePresenter) {}

  private get backLinkArgs() {
    return {
      text: 'Back',
      href: this.presenter.backLinkUri,
    }
  }

  private get radioArgsList(): RadiosArgs[] {
    return this.presenter.recordAttendanceBffData.people.map(person => ({
      name: `attendance-${person.referralId}`,
      fieldset: {
        legend: {
          text: this.presenter.recordAttendanceBffData.people.length > 1 ? `${person.name} (${person.crn})` : null,
          isPageHeading: false,
          classes: 'govuk-fieldset__legend--m',
        },
      },
      items:
        person.options?.map(option => ({
          value: option.value || '',
          text: option.text || '',
          hint: option.subtext ? { text: option.subtext } : undefined,
          checked: this.presenter.fields[`attendance-${person.referralId}`]?.value === option.value,
        })) || [],
      errorMessage: ViewUtils.govukErrorMessage(this.presenter.fields[`attendance-${person.referralId}`]?.errorMessage),
    }))
  }

  get renderArgs(): [string, Record<string, unknown>] {
    return [
      'attendance/recordAttendance.njk',
      {
        presenter: this.presenter,
        text: this.presenter.text,
        radioArgsList: this.radioArgsList,
        backLinkArgs: this.backLinkArgs,
        errorSummary: ViewUtils.govukErrorSummaryArgs(this.presenter.errorSummary),
      },
    ]
  }
}
