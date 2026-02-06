import { RescheduleSessionDetails, RescheduleSessionRequest } from '@manage-and-deliver-api'
import PresenterUtils from '../../utils/presenterUtils'
import { FormValidationError } from '../../utils/formValidationError'
import { SummaryListItem } from '../../utils/summaryList'
import DateUtils from '../../utils/dateUtils'
import ClockTime from '../../utils/clockTime'
import CalendarDay from '../../utils/calendarDay'

export default class OtherSessionsPresenter {
  constructor(
    readonly groupId: string,
    readonly rescheduleSessionDetails: RescheduleSessionDetails,
    readonly rescheduleSessionRequest: Partial<RescheduleSessionRequest>,
    private readonly validationError: FormValidationError | null = null,
  ) {}

  get utils() {
    return new PresenterUtils()
  }

  get text() {
    return {
      headingText: 'Rescheduling other sessions?',
      headingCaptionText: `Edit ${this.rescheduleSessionDetails.sessionName}`,
    }
  }

  get backLinkUri() {
    return `group/${this.groupId}/session/${this.rescheduleSessionDetails.sessionId}/edit-session-date-and-time`
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }

  get sessionDateAndTimesSummary(): SummaryListItem[] {
    const startTime = DateUtils.convertTo24Hour(
      this.rescheduleSessionRequest.sessionStartTime.hour,
      this.rescheduleSessionRequest.sessionStartTime.minutes,
      this.rescheduleSessionRequest.sessionStartTime.amOrPm,
    )
    const endTime = DateUtils.convertTo24Hour(
      this.rescheduleSessionRequest.sessionEndTime.hour,
      this.rescheduleSessionRequest.sessionEndTime.minutes,
      this.rescheduleSessionRequest.sessionEndTime.amOrPm,
    )
    const newSessionTime = DateUtils.formattedTimeRange(
      ClockTime.fromTwentyFourHourComponents(startTime.hour, startTime.minute, 0)!,
      ClockTime.fromTwentyFourHourComponents(endTime.hour, endTime.minute, 0)!,
      { casing: 'lowercase', includeZeroMinutes: false },
    )
    return [
      {
        key: 'Previous session date and time',
        keyClass: 'session-reschedule-table-key-width',
        lines: [`${this.rescheduleSessionDetails.previousSessionDateAndTime}`],
      },
      {
        key: 'New session date and time',
        keyClass: 'session-reschedule-table-key-width',
        lines: [`${this.formattedDate}, ${newSessionTime}`], // Get this from session storage.
      },
    ]
  }

  private get formattedDate(): string {
    const dateComponents = this.rescheduleSessionRequest.sessionStartDate.split('/')
    const dayOfWeek = DateUtils.dayOfWeek(
      CalendarDay.fromComponents(Number(dateComponents[0]), Number(dateComponents[1]), Number(dateComponents[2])),
    )
    const date = DateUtils.formattedDate(`${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`)
    return `${dayOfWeek} ${date}`
  }

  get fields() {
    return {
      rescheduleOtherSessions: {
        value: this.utils.booleanValue(null, 'reschedule-other-sessions'),
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'reschedule-other-sessions'),
      },
    }
  }
}
