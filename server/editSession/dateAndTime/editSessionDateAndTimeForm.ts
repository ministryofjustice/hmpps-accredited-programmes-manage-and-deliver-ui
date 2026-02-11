import { Request } from 'express'
import { RescheduleSessionRequest } from '@manage-and-deliver-api'
import { body, ValidationChain } from 'express-validator'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'

const fieldOrder = [
  'session-details-date',
  'session-details-start-time-hour',
  'session-details-start-time-minute',
  'session-details-start-time-part-of-day',
  'session-details-end-time-hour',
  'session-details-end-time-minute',
  'session-details-end-time-part-of-day',
  'session-details-who',
  'session-details-facilitator',
]

export default class EditSessionDateAndTimeFormForm {
  constructor(private readonly request: Request) {}

  async rescheduleSessionDetailsData(): Promise<FormData<Partial<RescheduleSessionRequest>>> {
    const validationResult = await FormUtils.runValidations({
      request: this.request,
      validations: this.createSessionDetailsValidations(),
    })

    const error = FormUtils.validationErrorFromResult(validationResult)
    if (error) {
      error.errors.sort((a, b) => {
        const aIndex = fieldOrder.indexOf(a.errorSummaryLinkedField)
        const bIndex = fieldOrder.indexOf(b.errorSummaryLinkedField)
        return aIndex - bIndex
      })
      return {
        paramsForUpdate: null,
        error,
      }
    }

    return {
      paramsForUpdate: {
        sessionStartDate: this.request.body['session-details-date'],
        sessionStartTime: {
          hour: parseInt(this.request.body['session-details-start-time-hour'], 10),
          minutes: parseInt(this.request.body['session-details-start-time-minute'], 10),
          amOrPm: this.request.body['session-details-start-time-part-of-day'] as 'AM' | 'PM',
        },
        sessionEndTime: {
          hour: parseInt(this.request.body['session-details-end-time-hour'], 10),
          minutes: parseInt(this.request.body['session-details-end-time-minute'], 10),
          amOrPm: this.request.body['session-details-end-time-part-of-day'] as 'AM' | 'PM',
        },
      },
      error: null,
    }
  }

  private createSessionDetailsValidations(): ValidationChain[] {
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
        .bail()
        .custom((value: string) => {
          const [day, month, year] = value.split('/').map(Number)
          const inputDate = new Date(year, month - 1, day)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          if (inputDate < today) {
            throw new Error(errorMessages.sessionSchedule.sessionDetailsDateInPast)
          }
          return true
        }),
      body(`session-details-start-time-hour`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsStartTime)
        .bail()
        .isInt({ min: 1, max: 12 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeHour),
      body(`session-details-start-time-minute`)
        .if(body('session-details-start-time-hour').notEmpty())
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
        .isInt({ min: 0, max: 59 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeMinute),
      body(`session-details-end-time-part-of-day`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsEndTimeAmPm),
    ]
  }
}
