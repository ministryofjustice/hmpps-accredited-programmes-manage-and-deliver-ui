import { FormValidationError } from './formValidationError'

interface DateTimeComponentInputPresenter {
  value: string
  hasError: boolean
}

interface PartOfDayInputPresenter {
  value: 'AM' | 'PM' | null
  hasError: boolean
}

interface TwelveHourTimeInputPresenter {
  errorMessage: string | null
  hour: DateTimeComponentInputPresenter
  minute: DateTimeComponentInputPresenter
  partOfDay: PartOfDayInputPresenter
}

export default class PresenterUtils {
  constructor(private readonly userInputData: Record<string, unknown> | null = null) {}

  stringValue(modelValue: string | number | null, userInputKey: string): string {
    if (this.userInputData === null) {
      return String(modelValue ?? '')
    }
    return String(this.userInputData[userInputKey] ?? '')
  }

  booleanValue(modelValue: boolean | null, userInputKey: string): boolean | null {
    if (this.userInputData === null) {
      return modelValue
    }
    if (this.userInputData[userInputKey] === 'yes') {
      return true
    }
    if (this.userInputData[userInputKey] === 'no') {
      return false
    }
    return null
  }

  private static sortedErrors<T extends { errorSummaryLinkedField: string }>(errors: T[], fieldOrder: string[]): T[] {
    const copiedErrors = errors.slice()
    return copiedErrors.sort((a, b) => {
      const [aIndex, bIndex] = [
        fieldOrder.indexOf(a.errorSummaryLinkedField),
        fieldOrder.indexOf(b.errorSummaryLinkedField),
      ]
      if (aIndex === -1) {
        return 1
      }
      if (bIndex === -1) {
        return -1
      }

      return aIndex - bIndex
    })
  }

  static errorSummary(
    error: { errors: { errorSummaryLinkedField: string; message: string }[] } | null,
    options: { fieldOrder: string[] } = { fieldOrder: [] },
  ): { field: string; message: string }[] | null {
    if (error === null) {
      return null
    }

    const sortedErrors = this.sortedErrors(error.errors, options.fieldOrder)

    return sortedErrors.map(subError => {
      return { field: subError.errorSummaryLinkedField, message: subError.message }
    })
  }

  static errorMessage(
    error: { errors: { formFields: string[]; message: string }[] } | null,
    field: string,
  ): string | null {
    if (error === null) {
      return null
    }

    const errorForField = error.errors.find(subError => subError.formFields.includes(field))

    return errorForField?.message ?? null
  }

  static hasError(error: { errors: { formFields: string[]; message: string }[] } | null, field: string): boolean {
    if (error === null) {
      return false
    }

    return !!error.errors.find(subError => subError.formFields.includes(field))
  }

  static yesOrNo(value?: boolean | null): 'No' | 'Yes' | 'Unknown' {
    if (value === null || value === undefined) {
      return 'Unknown'
    }
    return value ? 'Yes' : 'No'
  }

  twelveHourTimeValue(
    modelValue: {
      hour?: number
      minutes?: number
      amOrPm?: 'AM' | 'PM'
    },
    userInputKey: string,
    error: FormValidationError | null,
  ): TwelveHourTimeInputPresenter {
    const [hourKey, minuteKey, partOfDayKey] = ['hour', 'minute', 'part-of-day'].map(
      suffix => `${userInputKey}-${suffix}`,
    )

    const errorMessage =
      PresenterUtils.errorMessage(error, hourKey) ??
      PresenterUtils.errorMessage(error, minuteKey) ??
      PresenterUtils.errorMessage(error, partOfDayKey)

    let hourValue = ''
    let minuteValue = ''
    let partOfDayValue: 'AM' | 'PM' | null = null

    if (this.userInputData === null) {
      if (
        modelValue !== null &&
        (modelValue.hour !== undefined || modelValue.minutes !== undefined || modelValue.amOrPm !== undefined)
      ) {
        hourValue = modelValue.hour !== undefined ? modelValue.hour.toString().padStart(2, '0') : ''
        minuteValue = modelValue.minutes !== undefined ? modelValue.minutes.toString().padStart(2, '0') : ''
        partOfDayValue = modelValue.amOrPm ?? null
      }
    } else {
      hourValue = String(this.userInputData[hourKey] || '')
      minuteValue = String(this.userInputData[minuteKey] || '')

      if (this.userInputData[partOfDayKey] === 'AM' || this.userInputData[partOfDayKey] === 'PM') {
        partOfDayValue = this.userInputData[partOfDayKey] as 'AM' | 'PM'
      } else {
        partOfDayValue = null
      }
    }

    return {
      errorMessage,
      partOfDay: {
        value: partOfDayValue,
        hasError: PresenterUtils.hasError(error, partOfDayKey),
      },
      hour: {
        value: hourValue,
        hasError: PresenterUtils.hasError(error, hourKey),
      },
      minute: {
        value: minuteValue,
        hasError: PresenterUtils.hasError(error, minuteKey),
      },
    }
  }
}
