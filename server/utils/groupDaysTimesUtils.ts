import { CreateGroupSessionSlot } from '@manage-and-deliver-api'

const TWO_AND_HALF_HOURS_IN_MINUTES = 150

export default class GroupDaysTimesUtils {
  static formatTime(hour: number, minutes: number, amOrPm: string): string {
    const mins = String(minutes).padStart(2, '0')
    const period = amOrPm.toLowerCase()

    if (hour === 12 && mins === '00' && period === 'pm') {
      return 'midday'
    }

    if (hour === 12 && mins === '00' && period === 'am') {
      return 'midnight'
    }

    if (minutes === 0) {
      return `${hour}${period}`
    }

    return `${hour}:${mins}${period}`
  }

  static addTwoAndHalfHours(hour: number, minutes: number, amOrPm: string) {
    let h = hour % 12
    if (amOrPm.toLowerCase() === 'pm') {
      h += 12
    }

    let totalMinutes = h * 60 + minutes

    totalMinutes += TWO_AND_HALF_HOURS_IN_MINUTES

    totalMinutes %= 24 * 60

    const endHour24 = Math.floor(totalMinutes / 60)
    const endMinutes = totalMinutes % 60

    const endAmOrPm = endHour24 >= 12 ? 'pm' : 'am'
    let endHour12 = endHour24 % 12
    if (endHour12 === 0) endHour12 = 12

    return { endHour12, endMinutes, endAmOrPm }
  }

  static sentenceCase(value: string | undefined): string {
    if (!value) return ''
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
  }

  static formatStartDaysAndTimes(daysAndTimes: CreateGroupSessionSlot[] | undefined) {
    if (!daysAndTimes || daysAndTimes.length === 0) {
      return []
    }

    return daysAndTimes.map(slot => {
      const day = GroupDaysTimesUtils.sentenceCase(slot.dayOfWeek)
      const startHour = slot.hour
      const startMinutes = slot.minutes ?? 0
      const startAmOrPm = slot.amOrPm
      const formattedStart = GroupDaysTimesUtils.formatTime(startHour, startMinutes, startAmOrPm)
      const { endHour12, endMinutes, endAmOrPm } = GroupDaysTimesUtils.addTwoAndHalfHours(
        startHour,
        startMinutes,
        startAmOrPm,
      )

      const formattedEnd = GroupDaysTimesUtils.formatTime(endHour12, endMinutes, endAmOrPm)

      return `${day}s, ${formattedStart} to ${formattedEnd}`
    })
  }
}
