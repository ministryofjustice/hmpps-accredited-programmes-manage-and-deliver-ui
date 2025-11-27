import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'

type DayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

const DAY_LABELS: Record<DayKey, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
}

export default class CreateGroupWhenPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/date`
  }

  get utils() {
    return new PresenterUtils(this.createGroupFormData)
  }

  get fields() {
    return {
      createGroupWhen: {
        value: this.createGroupFormData?.createGroupSessionSlot?.[0]?.dayOfWeek,
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-when'),
      },
    }
  }

  get dayFieldErrors(): Partial<Record<DayKey, string>> {
    const days: DayKey[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
    const errors: Partial<Record<DayKey, string>> = {}

    days.forEach(day => {
      const fieldId = `create-group-when-${day.toLowerCase()}`
      const message = PresenterUtils.errorMessage(this.validationError, fieldId)
      if (message) {
        errors[day] = message
      }
    })

    return errors
  }

  get selectedDays(): string[] {
    return this.createGroupFormData?.createGroupSessionSlot?.map(slot => slot.dayOfWeek) ?? []
  }

  get dayTimes() {
    const slots = this.createGroupFormData?.createGroupSessionSlot ?? []
    const map: Record<string, { hour?: number; minutes?: number; amOrPm?: string }> = {}

    slots.forEach(slot => {
      map[slot.dayOfWeek] = {
        hour: slot.hour,
        minutes: slot.minutes,
        amOrPm: slot.amOrPm,
      }
    })

    return map
  }

  get errorSummary() {
    const rawSummary = PresenterUtils.errorSummary(this.validationError)

    if (!this.validationError) {
      return rawSummary
    }

    const baseSummary =
      rawSummary?.map(item => {
        if (!item.field) return item

        if (item.field.startsWith('create-group-when-')) {
          const rest = item.field.substring('create-group-when-'.length)
          const parts = rest.split('-')

          if (parts.length === 1) {
            return { ...item, field: parts[0] }
          }

          if (parts.length === 2 && ['hour', 'minute', 'ampm'].includes(parts[1])) {
            return { ...item, field: `${parts[0]}-${parts[1]}` }
          }
        }

        return item
      }) ?? []

    const extraErrors: Array<{ field: string; message: string }> = []
    const slots = this.createGroupFormData?.createGroupSessionSlot ?? []
    const { dayFieldErrors } = this

    slots.forEach(slot => {
      const day = slot.dayOfWeek as DayKey
      if (!day) return

      const label = DAY_LABELS[day]
      const dayLower = day.toLowerCase()

      if (!dayFieldErrors[day]) return

      const amOrPmMissing = !slot.amOrPm
      const minutesInvalidRange = slot.minutes != null && (slot.minutes < 0 || slot.minutes > 59)

      if (amOrPmMissing) {
        const field = `${dayLower}-ampm`
        const already = baseSummary.some(e => e.field === field)
        if (!already) {
          extraErrors.push({
            field,
            message: `Select am or pm for ${label}`,
          })
        }
      }

      if (minutesInvalidRange) {
        const field = `${dayLower}-minute`
        const already = baseSummary.some(e => e.field === field)
        if (!already) {
          extraErrors.push({
            field,
            message: `Enter minutes between 0 and 59 for ${label}`,
          })
        }
      }
    })

    const combined = [...baseSummary, ...extraErrors]

    return combined.length ? combined : null
  }
}
