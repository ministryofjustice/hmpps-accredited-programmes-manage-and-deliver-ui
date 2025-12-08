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
      slots[idBase] = {
        hour: {
          value: this.getSlotValue(
            key,
            'hour',
            this.createGroupFormData?.find(it => it.dayOfWeek === key.toString())?.hour.toString(),
          ),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-hour`),
        },
        minute: {
          value: this.getSlotValue(
            key,
            'minute',
            this.createGroupFormData?.find(it => it.dayOfWeek === key.toString())?.minutes.toString(),
          ),
          errorMessage: PresenterUtils.errorMessage(this.validationError, `${idBase}-minute`),
        },
        ampm: {
          value: this.getSlotValue(
            key,
            'ampm',
            this.createGroupFormData?.find(it => it.dayOfWeek === key.toString())?.amOrPm.toLowerCase(),
          ),
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
        errorMessages.length > 0
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

    if (filtered.length === 1) {
      const msg = filtered[0].trimEnd()
      return msg.endsWith('.') ? msg : `${msg}.`
    }

    const formatted = [filtered[0], ...filtered.slice(1).map(msg => msg.charAt(0).toLowerCase() + msg.slice(1))]

    const lastMessage = formatted.pop()
    const combined = `${formatted.join(', ')} and ${lastMessage}`
    const trimmed = combined.trimEnd()
    return trimmed.endsWith('.') ? trimmed : `${trimmed}.`
  }

  private get selectedDays(): DayKey[] {
    if (this.createGroupFormData) {
      return this.createGroupFormData.map(slot => slot.dayOfWeek as DayKey)
    }
    const daysOfWeek = this.userInputData?.['days-of-week'] as DayKey[] | DayKey
    if (!daysOfWeek) return []
    return Array.isArray(daysOfWeek) ? daysOfWeek : [daysOfWeek]
  }

  get errorSummary() {
    const summary = PresenterUtils.errorSummary(this.validationError)

    if (!summary) return summary

    return summary.map(item => {
      if (!item.message) return item
      const trimmed = item.message.trimEnd()
      return {
        ...item,
        message: trimmed.replace(/[.,]/g, '').trimEnd(),
      }
    })
  }
}
