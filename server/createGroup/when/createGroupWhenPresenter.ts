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
    private readonly validationError: FormValidationError | null = null,
    private readonly userInputData: Record<string, unknown> | null = null,
    private readonly groupCode: string,
  ) {}

  get text() {
    return { headingHintText: `Create group ${this.groupCode}` }
  }

  get backLinkUri() {
    return `/group/create-a-group/date`
  }

  get utils() {
    return new PresenterUtils(this.userInputData)
  }

  get fields() {
    const slots = {} as Record<string, SlotFields>

    DAY_CONFIG.forEach(({ idBase, key }) => {
      slots[idBase] = {
        hour: {
          value: this.getSlotValue(key, 'hour'),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-hour`),
        },
        minute: {
          value: this.getSlotValue(key, 'minute'),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-minute`),
        },
        ampm: {
          value: this.getSlotValue(key, 'amOrPm'),
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

  private getSlotValue(dayOfWeek: DayKey, field: 'hour' | 'minute' | 'amOrPm'): string | number {
    return this.utils.stringValue(null, `${dayOfWeek.toLowerCase()}-${field}`)
  }

  get whenWillGroupRunCheckBoxArgs(): CheckboxesArgsItem[] {
    const { selectedDays, dayTimes } = this

    return DAY_CONFIG.map(({ key, idBase, label }) => ({
      id: idBase,
      name: 'days-of-week',
      value: key,
      text: label,
      checked: selectedDays.includes(key),
      attributes: { 'data-aria-controls': `${idBase}-conditional` },
      conditional: {
        html: this.getConditionalHtml(idBase, idBase as keyof typeof this.fields.slots, dayTimes[key] || {}),
      },
    }))
  }

  private getConditionalHtml(
    idBase: string,
    key: keyof typeof this.fields.slots,
    timesForDay: { amOrPm?: string },
  ): string {
    const slot = this.fields.slots[key]
    const errorMessages = [slot.hour.errorMessage, slot.minute.errorMessage, slot.ampm.errorMessage]

    return `
    <div class="govuk-date-input" id="${idBase}-time">
      ${
        errorMessages.length > 0
          ? `
        <p id="${idBase}-error" class="govuk-error-message">
          <span class="govuk-visually-hidden">Error:</span> ${errorMessages.filter(Boolean).join(', ')}
        </p>
      `
          : ''
      }

      <div class="govuk-date-input__item">
        <div>
          <label class="govuk-label govuk-date-input__label" for="${idBase}-hour">Hour</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2 ${slot.hour.errorMessage ? 'govuk-input--error' : ''}"
            id="${idBase}-hour" name="${idBase}-hour" type="text" inputmode="numeric"
            pattern="[0-9]{1,2}" maxlength="2" value="${slot.hour.value}">
        </div>
      </div>

      <div class="govuk-date-input__item">
        <div>
          <label class="govuk-label govuk-date-input__label" for="${idBase}-minute">Minute</label>
          <input class="govuk-input govuk-date-input__input govuk-input--width-2 ${slot.minute.errorMessage ? 'govuk-input--error' : ''}"
            id="${idBase}-minute" name="${idBase}-minute" type="text" inputmode="numeric"
            pattern="[0-9]{1,2}" maxlength="2" value="${slot.minute.value}">
        </div>
      </div>

      <div class="govuk-date-input__item">
        <div>
          <label class="govuk-label govuk-date-input__label" for="${idBase}-ampm">am or pm</label>
          <select class="govuk-select govuk-date-select__select ${slot.ampm.errorMessage ? 'govuk-select--error' : ''}" id="${idBase}-ampm" name="${idBase}-ampm">
            <option value=""></option>
            <option value="am" ${timesForDay.amOrPm === 'AM' ? 'selected' : ''}>am</option>
            <option value="pm" ${timesForDay.amOrPm === 'PM' ? 'selected' : ''}>pm</option>
          </select>
        </div>
      </div>
    </div>
  `
  }

  get selectedDays(): DayKey[] {
    const daysOfWeek = this.userInputData?.['days-of-week'] as DayKey[] | DayKey
    if (!daysOfWeek) return []
    return Array.isArray(daysOfWeek) ? daysOfWeek : [daysOfWeek]
  }

  get dayTimes(): Record<DayKey, { hour?: number; minutes?: number; amOrPm?: string }> {
    const map = {} as Record<DayKey, { hour?: number; minutes?: number; amOrPm?: string }>

    DAY_CONFIG.forEach(day => {
      const { idBase, key } = day
      const hour = this.userInputData?.[`${idBase}-hour`]
      const minute = this.userInputData?.[`${idBase}-minute`]
      const ampm = this.userInputData?.[`${idBase}-ampm`]

      if (hour || minute || ampm) {
        map[key] = {
          hour: hour ? Number(hour) : undefined,
          minutes: minute ? Number(minute) : undefined,
          amOrPm: ampm as string | undefined,
        }
      }
    })

    return map
  }

  get errorSummary() {
    return PresenterUtils.errorSummary(this.validationError)
  }
}
