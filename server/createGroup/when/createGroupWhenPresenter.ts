import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { DAY_CONFIG, DayKey } from './daysOfWeek'

export default class CreateGroupWhenPresenter {
  constructor(
    private readonly validationError: FormValidationError | null = null,
    private readonly createGroupFormData: Partial<CreateGroupRequest> | null = null,
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.createGroupFormData?.groupCode}` }
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
    const errors: Partial<Record<DayKey, string>> = {}

    DAY_CONFIG.forEach(day => {
      const fieldId = `create-group-when-${day.idBase}`
      const message = PresenterUtils.errorMessage(this.validationError, fieldId)
      if (message) {
        errors[day.key] = message
      }
    })

    return errors
  }

  get selectedDays(): DayKey[] {
    return (this.createGroupFormData?.createGroupSessionSlot?.map(slot => slot.dayOfWeek) ?? []) as DayKey[]
  }

  get dayTimes() {
    const slots = this.createGroupFormData?.createGroupSessionSlot ?? []
    const map: Record<DayKey, { hour?: number; minutes?: number; amOrPm?: string }> = {} as Record<
      DayKey,
      { hour?: number; minutes?: number; amOrPm?: string }
    >

    slots.forEach(slot => {
      const day = slot.dayOfWeek as DayKey
      if (!day) return

      map[day] = {
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

      const dayConfig = DAY_CONFIG.find(d => d.key === day)
      if (!dayConfig) return

      const { label, idBase } = dayConfig
      const prettyDay = label.endsWith('s') ? label.slice(0, -1) : label

      if (!dayFieldErrors[day]) return

      const amOrPmMissing = !slot.amOrPm
      const minutesInvalidRange = slot.minutes != null && (slot.minutes < 0 || slot.minutes > 59)

      if (amOrPmMissing) {
        const field = `${idBase}-ampm`
        const already = baseSummary.some(e => e.field === field)
        if (!already) {
          extraErrors.push({
            field,
            message: `Select am or pm for ${prettyDay}`,
          })
        }
      }

      if (minutesInvalidRange) {
        const field = `${idBase}-minute`
        const already = baseSummary.some(e => e.field === field)
        if (!already) {
          extraErrors.push({
            field,
            message: `Enter minutes between 0 and 59 for ${prettyDay}`,
          })
        }
      }
    })

    const combined = [...baseSummary, ...extraErrors]

    return combined.length ? combined : null
  }
}
