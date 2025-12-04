import { CreateGroupSessionSlot } from '@manage-and-deliver-api'
import { FormValidationError } from '../../utils/formValidationError'
import PresenterUtils from '../../utils/presenterUtils'
import { DAY_CONFIG, DayKey } from './daysOfWeek'
import { CheckboxesArgsItem } from '../../utils/govukFrontendTypes'

interface SlotFields {
  hour: {
    value: string | number
    errorMessage: string | null
  }
  minute: {
    value: string | number
    errorMessage: string | null
  }
  ampm: {
    value: string | number
    errorMessage: string | null
  }
}

export default class CreateGroupWhenPresenter {
  constructor(
    private readonly groupCode: string,
    private readonly createGroupFormData: CreateGroupSessionSlot[],
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/group-start-date`
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    const slots = {} as Record<string, SlotFields>

    DAY_CONFIG.forEach(({ idBase, key }) => {
      const slotForDay = this.createGroupFormData?.find(it => it.dayOfWeek === key.toString())
      slots[idBase] = {
        hour: {
          value: this.getSlotValue(key, 'hour', slotForDay?.hour?.toString() ?? null),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-hour`),
        },
        minute: {
          value: this.getSlotValue(key, 'minute', slotForDay?.minutes?.toString() ?? null),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-minute`),
        },
        ampm: {
          value: this.getSlotValue(key, 'ampm', slotForDay?.amOrPm?.toLowerCase() ?? null),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-ampm`),
        },
      }
    })

    return {
      slots,
      createGroupWhen: {
        errorMessage: PresenterUtils.errorMessage(this.validationError, 'create-group-when'),
      },
    }
  }

  private getSlotValue(
    dayOfWeek: DayKey,
    field: 'hour' | 'minute' | 'ampm',
    modelValue: string | null,
  ): string | number {
    return this.utils.stringValue(modelValue, `${dayOfWeek.toLowerCase()}-${field}`)
  }

  get whenWillGroupRunCheckBoxArgs(): CheckboxesArgsItem[] {
    const { selectedDays } = this

    return DAY_CONFIG.map(({ key, idBase, label }) => ({
      id: idBase,
      name: 'days-of-week',
      value: key,
      text: label,
      checked: selectedDays.includes(key),
      attributes: { 'data-aria-controls': `${idBase}-conditional` },
      conditional: {
        html: this.getConditionalHtml(idBase, idBase as keyof typeof this.fields.slots),
      },
    }))
  }

  private getConditionalHtml(idBase: string, key: keyof typeof this.fields.slots): string {
    const slot = this.fields.slots[key]
    const errorMessages = [slot.hour.errorMessage, slot.minute.errorMessage, slot.ampm.errorMessage]
    const formattedErrorMessage = this.formatErrorMessages(errorMessages)

    return `
    <div class="govuk-date-input" id="${idBase}-time">
      ${
        errorMessages.filter(Boolean).length > 0
          ? `
        <p id="${idBase}-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">Error:</span> ${formattedErrorMessage}
        </p>
      `
          : ''
      }
      <div class="govuk-date-input__item">
        <div>
          <label class="govuk-label govuk-date-input__label" for="${idBase}-hour">Hour</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2 ${
            slot.hour.errorMessage ? 'govuk-input--error' : ''
          }"
            id="${idBase}-hour" name="${idBase}-hour" type="text" inputmode="numeric"
            pattern="[0-9]{1,2}" maxlength="2" value="${slot.hour.value}">
        </div>
      </div>

      <div class="govuk-date-input__item">
        <div>
          <label class="govuk-label govuk-date-input__label" for="${idBase}-minute">Minute</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2 ${
            slot.minute.errorMessage ? 'govuk-input--error' : ''
          }"
            id="${idBase}-minute" name="${idBase}-minute" type="text" inputmode="numeric"
            pattern="[0-9]{1,2}" maxlength="2" value="${slot.minute.value}">
        </div>
      </div>

      <div class="govuk-date-input__item">
        <div>
          <label class="govuk-label govuk-date-input__label" for="${idBase}-ampm">am or pm</label>
          <select class="govuk-select govuk-date-select__select ${
            slot.ampm.errorMessage ? 'govuk-select--error' : ''
          }" id="${idBase}-ampm" name="${idBase}-ampm">
            <option value=""></option>
            <option value="am" ${slot.ampm.value === 'am' ? 'selected' : ''}>am</option>
            <option value="pm" ${slot.ampm.value === 'pm' ? 'selected' : ''}>pm</option>
          </select>
        </div>
      </div>
    </div>
  `
  }

  private formatErrorMessages(errors: (string | null)[]): string {
    const filtered = errors.filter(Boolean) as string[]
    if (filtered.length === 0) return ''
    if (filtered.length === 1) return filtered[0]

    const formatted = [filtered[0], ...filtered.slice(1).map(msg => msg.charAt(0).toLowerCase() + msg.slice(1))]

    const lastMessage = formatted.pop()
    return `${formatted.join(', ')} and ${lastMessage}`
  }

  private get selectedDays(): DayKey[] {
    if (this.createGroupFormData) {
      return this.createGroupFormData.map(slot => slot.dayOfWeek as DayKey)
    }
    const daysOfWeek = this.userInputData?.['days-of-week'] as DayKey[] | DayKey
    if (!daysOfWeek) return []
    return Array.isArray(daysOfWeek) ? daysOfWeek : [daysOfWeek]
  }

  // Top-level day errors used for deriving extra errors
  private get dayFieldErrors(): Partial<Record<DayKey, string>> {
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
    const slots = this.createGroupFormData ?? []
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

    type SummaryItem = (typeof combined)[number]

    type DayErrorGroup = {
      hour?: SummaryItem
      minute?: SummaryItem
      ampm?: SummaryItem
      other: SummaryItem[]
    }

    const dayGroups: Record<string, DayErrorGroup> = {}
    DAY_CONFIG.forEach(day => {
      dayGroups[day.idBase] = { other: [] }
    })

    const nonDayErrors: SummaryItem[] = []

    const hasMessage = (group: DayErrorGroup, message?: string) => {
      if (!message) return false
      return (
        (group.hour && group.hour.message === message) ||
        (group.minute && group.minute.message === message) ||
        (group.ampm && group.ampm.message === message) ||
        group.other.some(i => i.message === message)
      )
    }

    combined.forEach(item => {
      const { field, message } = item

      if (!field) {
        nonDayErrors.push(item)
        return
      }

      const dayConfig = DAY_CONFIG.find(d => field === d.idBase || field.startsWith(`${d.idBase}-`))

      if (!dayConfig) {
        nonDayErrors.push(item)
        return
      }

      const group = dayGroups[dayConfig.idBase]

      // Avoid duplicate messages for the same day (e.g. two "Select am or pm for Monday")
      if (hasMessage(group, message)) {
        return
      }

      if (field === dayConfig.idBase || field.endsWith('-hour')) {
        if (!group.hour) group.hour = item
        return
      }

      if (field.endsWith('-minute')) {
        if (!group.minute) group.minute = item
        return
      }

      if (field.endsWith('-ampm')) {
        if (!group.ampm) group.ampm = item
        return
      }

      group.other.push(item)
    })

    const ordered: SummaryItem[] = [...nonDayErrors]

    DAY_CONFIG.forEach(day => {
      const group = dayGroups[day.idBase]
      if (!group) return
      if (group.hour) ordered.push(group.hour)
      if (group.minute) ordered.push(group.minute)
      if (group.ampm) ordered.push(group.ampm)
      ordered.push(...group.other)
    })

    const finalSummary = ordered.length
      ? ordered.map(item => ({
          ...item,
          message: item.message.endsWith('.') ? item.message : `${item.message}.`,
        }))
      : null

    return finalSummary
  }
}
