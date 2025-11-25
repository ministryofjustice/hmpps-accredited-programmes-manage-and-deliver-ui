import { CreateGroupRequest } from '@manage-and-deliver-api'
import { FormValidationError } from '../utils/formValidationError'
import PresenterUtils from '../utils/presenterUtils'

type DayKey = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'

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

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
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
}
