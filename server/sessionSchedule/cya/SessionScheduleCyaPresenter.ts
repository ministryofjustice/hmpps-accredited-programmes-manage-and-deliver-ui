import { ScheduleSessionRequest } from '@manage-and-deliver-api'
import DateUtils from '../../utils/dateUtils'
import ClockTime from '../../utils/clockTime'
import CalendarDay from '../../utils/calendarDay'

export default class SessionScheduleCyaPresenter {
  constructor(
    readonly linkUrl: string,
    readonly createSessionDetails:
      | (Partial<ScheduleSessionRequest> & { sessionName?: string; referralName?: string })
      | null = null,
  ) {}

  get text() {
    return {
      headingCaptionText: `Schedule a ${this.createSessionDetails.sessionName}`,
      headingText: `Review your session details`,
    }
  }

  convertTo24Hour(hour: number, minute: number, period: 'AM' | 'PM'): { hour: number; minute: number } {
    let hour24 = hour
    if (period === 'AM') {
      hour24 = hour === 12 ? 0 : hour // 12 AM is midnight (0), other AM hours stay the same
    } else {
      hour24 = hour === 12 ? 12 : hour + 12 // 12 PM stays 12, other PM hours add 12
    }
    return { hour: hour24, minute }
  }

  get formattedTime(): string {
    const startTime = this.convertTo24Hour(
      this.createSessionDetails.startTime.hour,
      this.createSessionDetails.startTime.minutes,
      this.createSessionDetails.startTime.amOrPm,
    )
    const endTime = this.convertTo24Hour(
      this.createSessionDetails.endTime.hour,
      this.createSessionDetails.endTime.minutes,
      this.createSessionDetails.endTime.amOrPm,
    )
    return DateUtils.formattedTimeRange(
      ClockTime.fromTwentyFourHourComponents(startTime.hour, startTime.minute, 0)!,
      ClockTime.fromTwentyFourHourComponents(endTime.hour, endTime.minute, 0)!,
      { casing: 'lowercase', includeZeroMinutes: false },
    )
  }

  get formattedDate(): string {
    const dateComponents = this.createSessionDetails.startDate.split('/')
    const dayOfWeek = DateUtils.dayOfWeek(
      CalendarDay.fromComponents(Number(dateComponents[0]), Number(dateComponents[1]), Number(dateComponents[2])),
    )
    const date = DateUtils.formattedDate(`${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`)
    return `${dayOfWeek} ${date}`
  }

  get backLinkUri() {
    return `${this.linkUrl}/schedule-session-type`
  }
}
