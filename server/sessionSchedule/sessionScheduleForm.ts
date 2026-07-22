import { Request } from 'express'
import { CreateGroupTeamMember, ScheduleSessionRequest } from '@manage-and-deliver-api'
import { body, ValidationChain } from 'express-validator'
import { FormData } from '../utils/forms/formData'
import FormUtils from '../utils/formUtils'
import { FormValidationError } from '../utils/formValidationError'
import errorMessages from '../utils/errorMessages'

const fieldOrder = [
  'session-details-date',
  'session-details-start-time-hour',
  'session-details-start-time-minute',
  'session-details-start-time-part-of-day',
  'session-details-end-time-hour',
  'session-details-end-time-minute',
  'session-details-end-time-part-of-day',
  'session-details-who',
  'session-details-facilitator-0',
]

export default class CreateSessionScheduleForm {
  constructor(private readonly request: Request) {}

  async sessionDetailsData(): Promise<FormData<Partial<ScheduleSessionRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createSessionDetailsValidations(),
    })

    const validationError = FormUtils.validationErrorFromResult(validationResult)
    const duplicateFacilitatorErrors = this.createDuplicateFacilitatorErrors()

    if (validationError || duplicateFacilitatorErrors.length > 0) {
      const error: FormValidationError = {
        errors: [...(validationError?.errors || []), ...duplicateFacilitatorErrors],
      }
      error.errors.sort((a, b) => {
        const aIndex = this.fieldOrderIndex(a.errorSummaryLinkedField)
        const bIndex = this.fieldOrderIndex(b.errorSummaryLinkedField)
        return aIndex - bIndex
      })
      return {
        paramsForUpdate: null,
        error,
      }
    }

    let whoValue = this.request.body['session-details-who']
    // Ensure whoValue is always an array
    if (!Array.isArray(whoValue)) {
      whoValue = [whoValue]
    }
    // Generate the list of referralIds from the whoValue which is in format '12345 + Alex River'
    const referralIds = whoValue.map((IdAndName: string) => IdAndName.split('+')[0].trim())

    return {
      paramsForUpdate: {
        referralIds,
        facilitators: this.getFacilitators(),
        startDate: this.request.body['session-details-date'],
        startTime: {
          hour: parseInt(this.request.body['session-details-start-time-hour'], 10),
          minutes:
            this.request.body['session-details-start-time-minute'] === '' ||
            this.request.body['session-details-start-time-minute'] === undefined
              ? 0
              : Number(this.request.body['session-details-start-time-minute']),
          amOrPm: this.request.body['session-details-start-time-part-of-day'] as 'AM' | 'PM',
        },
        endTime: {
          hour: parseInt(this.request.body['session-details-end-time-hour'], 10),
          minutes:
            this.request.body['session-details-end-time-minute'] === '' ||
            this.request.body['session-details-end-time-minute'] === undefined
              ? 0
              : Number(this.request.body['session-details-end-time-minute']),
          amOrPm: this.request.body['session-details-end-time-part-of-day'] as 'AM' | 'PM',
        },
      },
      error: null,
    }
  }

  private createSessionDetailsValidations(): ValidationChain[] {
    const hasFacilitator = Object.entries(this.request.body).some(
      ([key, value]) => key.startsWith('session-details-facilitator') && value !== '',
    )
    function convertTo24Hour(hour: number, minute: number, period: 'AM' | 'PM'): { hour: number; minute: number } {
      let hour24 = hour
      if (period === 'AM') {
        hour24 = hour === 12 ? 0 : hour // 12 AM is midnight (0), other AM hours stay the same
      } else {
        hour24 = hour === 12 ? 12 : hour + 12 // 12 PM stays 12, other PM hours add 12
      }
      return { hour: hour24, minute }
    }

    function isTimeBefore(
      startHour: number,
      startMinute: number,
      startPeriod: 'AM' | 'PM',
      endHour: number,
      endMinute: number,
      endPeriod: 'AM' | 'PM',
    ): boolean {
      const start = convertTo24Hour(startHour, startMinute, startPeriod)
      const end = convertTo24Hour(endHour, endMinute, endPeriod)

      if (start.hour !== end.hour) {
        return start.hour < end.hour
      }
      return start.minute < end.minute
    }
    return [
      body('session-details-date')
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsDate)
        .bail()
        .matches(/^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/)
        .withMessage(errorMessages.sessionSchedule.sessionDetailsDateInvalid)
        .bail(),
      body(`session-details-start-time-hour`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsStartTime)
        .bail()
        .isInt({ min: 1, max: 12 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeHour),
      body(`session-details-start-time-minute`)
        .if(body('session-details-start-time-hour').notEmpty())
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 59 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeMinute),
      body(`session-details-start-time-part-of-day`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsStartTimeAmPm),
      body(`session-details-end-time-hour`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsEndTime)
        .bail()
        .isInt({ min: 1, max: 12 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeHour)
        .if(body('session-details-start-time-hour').notEmpty())
        .custom((endHourValue, { req }) => {
          const startHour = parseInt(req.body['session-details-start-time-hour'], 10)
          const startMinute = parseInt(req.body['session-details-start-time-minute'] || '0', 10)
          const startPartOfDay = req.body['session-details-start-time-part-of-day']

          const endHour = parseInt(endHourValue, 10)
          const endMinute = parseInt(req.body['session-details-end-time-minute'] || '0', 10)
          const endPartOfDay = req.body['session-details-end-time-part-of-day']

          if (!startHour || !startPartOfDay || startHour < 1 || startHour > 12 || startMinute < 0 || startMinute > 59) {
            // Skip validation if start time is invalid
            return true
          }

          if (!isTimeBefore(startHour, startMinute, startPartOfDay, endHour, endMinute, endPartOfDay)) {
            throw new Error(errorMessages.sessionSchedule.sessionDetailsEndTimeBeforeStart)
          }
          return true
        }),
      body(`session-details-end-time-minute`)
        .if(body('session-details-end-time-hour').notEmpty())
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 59 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeMinute),
      body(`session-details-end-time-part-of-day`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsEndTimeAmPm),
      body('session-details-who').notEmpty().withMessage(errorMessages.sessionSchedule.sessionDetailsWho),
      body('session-details-facilitator-0')
        .custom(() => {
          return hasFacilitator
        })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsFacilitator),
    ]
  }

  private fieldOrderIndex(field: string): number {
    const directIndex = fieldOrder.indexOf(field)
    if (directIndex !== -1) {
      return directIndex
    }
    const facilitatorMatch = field.match(/^session-details-facilitator-(\d+)$/)
    if (facilitatorMatch) {
      const baseIndex = fieldOrder.indexOf('session-details-facilitator-0')
      return baseIndex + Number(facilitatorMatch[1])
    }
    return fieldOrder.length
  }

  private createDuplicateFacilitatorErrors(): FormValidationError['errors'] {
    const selections = this.getFacilitatorSelections()
    const fieldNamesByCode = new Map<string, string[]>()

    selections.forEach(({ fieldName, facilitatorCode }) => {
      const existing = fieldNamesByCode.get(facilitatorCode) || []
      existing.push(fieldName)
      fieldNamesByCode.set(facilitatorCode, existing)
    })

    const duplicateFieldNames = new Set<string>()
    fieldNamesByCode.forEach(fieldNames => {
      if (fieldNames.length > 1) {
        fieldNames.forEach(fieldName => duplicateFieldNames.add(fieldName))
      }
    })

    if (duplicateFieldNames.size === 0) {
      return []
    }

    const orderedFieldNames = selections
      .map(selection => selection.fieldName)
      .filter((fieldName, index, allFieldNames) => {
        return duplicateFieldNames.has(fieldName) && allFieldNames.indexOf(fieldName) === index
      })

    return orderedFieldNames.map(fieldName => ({
      formFields: [fieldName],
      errorSummaryLinkedField: fieldName,
      message: errorMessages.sessionSchedule.sessionDetailsFacilitatorDuplicate,
    }))
  }

  private getFacilitatorSelections(): Array<{ fieldName: string; facilitatorCode: string }> {
    return Object.entries(this.request.body)
      .filter(([key, value]) => key.startsWith('session-details-facilitator') && value)
      .map(([key, value]) => ({
        fieldName: key,
        facilitatorCode: this.parseFacilitatorCode(value),
      }))
      .filter((selection): selection is { fieldName: string; facilitatorCode: string } =>
        Boolean(selection.facilitatorCode),
      )
  }

  private parseFacilitatorCode(value: unknown): string {
    if (typeof value !== 'string') {
      return ''
    }
    try {
      return JSON.parse(value)?.facilitatorCode || ''
    } catch {
      return ''
    }
  }

  private getFacilitators(): CreateGroupTeamMember[] {
    const facilitatorEntries = Object.entries(this.request.body).filter(([key]) =>
      key.startsWith('session-details-facilitator'),
    )
    return facilitatorEntries
      .filter(([_key, value]) => value !== '')
      .map(([_key, value]) => {
        const parsedValue = JSON.parse(value as string)
        return {
          ...parsedValue,
          teamMemberType: 'REGULAR_FACILITATOR',
        } as CreateGroupTeamMember
      })
  }
}
