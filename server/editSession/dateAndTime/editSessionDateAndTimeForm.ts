import { Request } from 'express'
import { RescheduleSessionRequest } from '@manage-and-deliver-api'
import { body, ValidationChain } from 'express-validator'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'
import DateUtils from '../../utils/dateUtils'

const fieldOrder = [
  'session-details-date',
  'session-details-start-time-hour',
  'session-details-start-time-minute',
  'session-details-start-time-part-of-day',
  'session-details-end-time-hour',
  'session-details-end-time-minute',
  'session-details-end-time-part-of-day',
  'session-details-who',
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
          minutes: parseInt(this.request.body['session-details-start-time-minute'] || '0', 10),
          amOrPm: this.request.body['session-details-start-time-part-of-day'] as 'AM' | 'PM',
        },
        sessionEndTime: {
          hour: parseInt(this.request.body['session-details-end-time-hour'], 10),
          minutes: parseInt(this.request.body['session-details-end-time-minute'] || '0', 10),
          amOrPm: this.request.body['session-details-end-time-part-of-day'] as 'AM' | 'PM',
        },
      },
      error: null,
    }
  }

  private createSessionDetailsValidations(): ValidationChain[] {
    const dateValidation = body('session-details-date')
      .notEmpty()
      .withMessage(errorMessages.sessionSchedule.sessionDetailsDate)
      .bail()
      .matches(/^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/)
      .withMessage(errorMessages.sessionSchedule.sessionDetailsDateInvalid)

    return [
      dateValidation,

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
        .bail()
        .if(body('session-details-start-time-hour').notEmpty())
        .custom((endHourValue, { req }) => {
          const startHourValue = req.body['session-details-start-time-hour']
          const startHour = parseInt(startHourValue, 10)
          const startMinuteValue = req.body['session-details-start-time-minute']
          const startMinute = parseInt(startMinuteValue || '0', 10)
          const startPartOfDay = req.body['session-details-start-time-part-of-day']

          const endHour = parseInt(endHourValue, 10)
          const endMinuteValue = req.body['session-details-end-time-minute']
          const endMinute = parseInt(endMinuteValue || '0', 10)
          const endPartOfDay = req.body['session-details-end-time-part-of-day']

          if (
            Number.isNaN(startHour) ||
            startHour < 1 ||
            startHour > 12 ||
            !startPartOfDay ||
            Number.isNaN(startMinute) ||
            startMinute < 0 ||
            startMinute > 59
          ) {
            // Skip validation if start time is invalid
            return true
          }

          if (
            Number.isNaN(endHour) ||
            endHour < 1 ||
            endHour > 12 ||
            !endPartOfDay ||
            Number.isNaN(endMinute) ||
            endMinute < 0 ||
            endMinute > 59
          ) {
            // Skip cross-field validation if end time is invalid or incomplete
            return true
          }

          if (!DateUtils.isTimeBefore(startHour, startMinute, startPartOfDay, endHour, endMinute, endPartOfDay)) {
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
    ]
  }
}
