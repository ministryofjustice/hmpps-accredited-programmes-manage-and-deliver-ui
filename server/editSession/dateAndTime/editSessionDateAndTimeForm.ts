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
  constructor(
    private readonly request: Request,
    private readonly isSessionInPast: boolean = false,
    private readonly originalStartTime?: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' },
    private readonly originalEndTime?: { hour: number; minutes: number; amOrPm: 'AM' | 'PM' },
  ) {}

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
    const { isSessionInPast } = this

    function convertTo24Hour(hour: number, minute: number, period: 'AM' | 'PM'): { hour: number; minute: number } {
      let hour24 = hour
      if (period === 'AM') {
        hour24 = hour === 12 ? 0 : hour // 12 AM is midnight (0), other AM hours stay the same
      } else {
        hour24 = hour === 12 ? 12 : hour + 12 // 12 PM stays 12, other PM hours add 12
      }
      return { hour: hour24, minute }
    }

    function durationInMinutes(
      startHour: number,
      startMinute: number,
      startPeriod: 'AM' | 'PM',
      endHour: number,
      endMinute: number,
      endPeriod: 'AM' | 'PM',
    ): number {
      const start = convertTo24Hour(startHour, startMinute, startPeriod)
      const end = convertTo24Hour(endHour, endMinute, endPeriod)
      return end.hour * 60 + end.minute - (start.hour * 60 + start.minute)
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

    function isSubmittedDateInPast(value: unknown): boolean {
      if (typeof value !== 'string') {
        return false
      }

      const ukMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (!ukMatch) {
        return false
      }

      const [, day, month, year] = ukMatch
      const inputDate = new Date(Number(year), Number(month) - 1, Number(day))
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      return inputDate < today
    }

    function isSubmittedDateTodayAndStarted(
      value: unknown,
      startHour: number,
      startMinute: number,
      startPeriod: 'AM' | 'PM',
    ): boolean {
      if (typeof value !== 'string') {
        return false
      }

      const ukMatch = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
      if (!ukMatch) {
        return false
      }

      const [, day, month, year] = ukMatch
      const inputDate = new Date(Number(year), Number(month) - 1, Number(day))
      const now = new Date()
      const today = new Date(now)
      today.setHours(0, 0, 0, 0)
      inputDate.setHours(0, 0, 0, 0)

      if (inputDate.getTime() !== today.getTime()) {
        return false
      }

      const start24 = convertTo24Hour(startHour, startMinute, startPeriod)
      const submittedStart = new Date(inputDate)
      submittedStart.setHours(start24.hour, start24.minute, 0, 0)

      return submittedStart < now
    }

    const { originalStartTime, originalEndTime } = this

    function startTimeChanged(submittedHour: number, submittedMinute: number, submittedPeriod: 'AM' | 'PM'): boolean {
      if (!originalStartTime) return true
      const orig = convertTo24Hour(originalStartTime.hour, originalStartTime.minutes, originalStartTime.amOrPm)
      const sub = convertTo24Hour(submittedHour, submittedMinute, submittedPeriod)
      return orig.hour !== sub.hour || orig.minute !== sub.minute
    }

    function endTimeChanged(submittedHour: number, submittedMinute: number, submittedPeriod: 'AM' | 'PM'): boolean {
      if (!originalEndTime) return true
      const orig = convertTo24Hour(originalEndTime.hour, originalEndTime.minutes, originalEndTime.amOrPm)
      const sub = convertTo24Hour(submittedHour, submittedMinute, submittedPeriod)
      return orig.hour !== sub.hour || orig.minute !== sub.minute
    }

    const originalDurationMinutes =
      originalStartTime && originalEndTime
        ? durationInMinutes(
            originalStartTime.hour,
            originalStartTime.minutes,
            originalStartTime.amOrPm,
            originalEndTime.hour,
            originalEndTime.minutes,
            originalEndTime.amOrPm,
          )
        : null

    const dateValidation = body('session-details-date')
      .notEmpty()
      .withMessage(errorMessages.sessionSchedule.sessionDetailsDate)
      .bail()
      .matches(/^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/)
      .withMessage(errorMessages.sessionSchedule.sessionDetailsDateInvalid)

    if (!isSessionInPast) {
      dateValidation.bail().custom((value: string) => {
        const [day, month, year] = value.split('/').map(Number)
        const inputDate = new Date(year, month - 1, day)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (inputDate < today) {
          throw new Error(errorMessages.sessionSchedule.sessionDetailsDateInPast)
        }
        return true
      })
    }

    return [
      dateValidation,
      body(`session-details-start-time-hour`)
        .notEmpty()
        .withMessage(errorMessages.sessionSchedule.sessionDetailsStartTime)
        .bail()
        .isInt({ min: 1, max: 12 })
        .withMessage(errorMessages.sessionSchedule.sessionDetailsTimeHour)
        .if(body('session-details-end-time-hour').notEmpty())
        .custom((startHourValue, { req }) => {
          const startHour = parseInt(startHourValue, 10)
          const startMinuteValue = req.body['session-details-start-time-minute']
          const startMinute = parseInt(startMinuteValue, 10)
          const startPartOfDay = req.body['session-details-start-time-part-of-day']

          const endHourValue = req.body['session-details-end-time-hour']
          const endHour = parseInt(endHourValue, 10)
          const endMinuteValue = req.body['session-details-end-time-minute']
          const endMinute = parseInt(endMinuteValue, 10)
          const endPartOfDay = req.body['session-details-end-time-part-of-day']

          if (
            Number.isNaN(startHour) ||
            startHour < 1 ||
            startHour > 12 ||
            !startPartOfDay ||
            Number.isNaN(startMinute) ||
            startMinute < 0 ||
            startMinute > 59 ||
            Number.isNaN(endHour) ||
            endHour < 1 ||
            endHour > 12 ||
            !endPartOfDay ||
            Number.isNaN(endMinute) ||
            endMinute < 0 ||
            endMinute > 59
          ) {
            return true
          }

          const shouldValidatePastDuration =
            isSessionInPast ||
            isSubmittedDateInPast(req.body['session-details-date']) ||
            isSubmittedDateTodayAndStarted(req.body['session-details-date'], startHour, startMinute, startPartOfDay)

          if (shouldValidatePastDuration) {
            const startChanged = startTimeChanged(startHour, startMinute, startPartOfDay)
            const endChanged = endTimeChanged(endHour, endMinute, endPartOfDay)
            // Show error on start time if start was changed (whether or not end was also changed)
            if (startChanged) {
              const duration = durationInMinutes(
                startHour,
                startMinute,
                startPartOfDay,
                endHour,
                endMinute,
                endPartOfDay,
              )
              if (originalDurationMinutes !== null && duration > originalDurationMinutes) {
                throw new Error(
                  errorMessages.rescheduleSession.editSessionDateAndTime
                    .sessionDetailsDurationLongerThanOriginallyScheduled,
                )
              }
            }
          }

          return true
        }),
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
          const startHourValue = req.body['session-details-start-time-hour']
          const startHour = parseInt(startHourValue, 10)
          const startMinuteValue = req.body['session-details-start-time-minute']
          const startMinute = parseInt(startMinuteValue, 10)
          const startPartOfDay = req.body['session-details-start-time-part-of-day']

          const endHour = parseInt(endHourValue, 10)
          const endMinuteValue = req.body['session-details-end-time-minute']
          const endMinute = parseInt(endMinuteValue, 10)
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

          if (!isTimeBefore(startHour, startMinute, startPartOfDay, endHour, endMinute, endPartOfDay)) {
            throw new Error(errorMessages.sessionSchedule.sessionDetailsEndTimeBeforeStart)
          }

          const shouldValidatePastDuration =
            isSessionInPast ||
            isSubmittedDateInPast(req.body['session-details-date']) ||
            isSubmittedDateTodayAndStarted(req.body['session-details-date'], startHour, startMinute, startPartOfDay)
          if (shouldValidatePastDuration) {
            const endChanged = endTimeChanged(endHour, endMinute, endPartOfDay)
            // Show error on end time if end was changed (whether or not start was also changed)
            if (endChanged) {
              const duration = durationInMinutes(
                startHour,
                startMinute,
                startPartOfDay,
                endHour,
                endMinute,
                endPartOfDay,
              )
              if (originalDurationMinutes !== null && duration > originalDurationMinutes) {
                throw new Error(
                  errorMessages.rescheduleSession.editSessionDateAndTime
                    .sessionDetailsDurationLongerThanOriginallyScheduled,
                )
              }
            }
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
