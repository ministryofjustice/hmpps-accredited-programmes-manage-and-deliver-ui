import { Request } from 'express'
import { RescheduleSessionRequest } from '@manage-and-deliver-api'
import { body, ValidationChain } from 'express-validator'
import FormUtils from '../../utils/formUtils'
import { FormData } from '../../utils/forms/formData'
import errorMessages from '../../utils/errorMessages'
import DateUtils from '../../utils/dateUtils'
import DateFormatUtils from '../../utils/dateFormatUtils'

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
    private readonly isSessionEnded: boolean = false,
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
    const { isSessionEnded } = this
    function durationInMinutes(
      startHour: number,
      startMinute: number,
      startPeriod: 'AM' | 'PM',
      endHour: number,
      endMinute: number,
      endPeriod: 'AM' | 'PM',
    ): number {
      const start = DateUtils.convertTo24Hour(startHour, startMinute, startPeriod)
      const end = DateUtils.convertTo24Hour(endHour, endMinute, endPeriod)
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
      const start = DateUtils.convertTo24Hour(startHour, startMinute, startPeriod)
      const end = DateUtils.convertTo24Hour(endHour, endMinute, endPeriod)

      if (start.hour !== end.hour) {
        return start.hour < end.hour
      }
      return start.minute < end.minute
    }
    const { originalStartTime, originalEndTime } = this

    function startTimeChanged(submittedHour: number, submittedMinute: number, submittedPeriod: 'AM' | 'PM'): boolean {
      if (!originalStartTime) return true
      const orig = DateUtils.convertTo24Hour(
        originalStartTime.hour,
        originalStartTime.minutes,
        originalStartTime.amOrPm,
      )
      const sub = DateUtils.convertTo24Hour(submittedHour, submittedMinute, submittedPeriod)
      return orig.hour !== sub.hour || orig.minute !== sub.minute
    }

    function endTimeChanged(submittedHour: number, submittedMinute: number, submittedPeriod: 'AM' | 'PM'): boolean {
      if (!originalEndTime) return true
      const orig = DateUtils.convertTo24Hour(originalEndTime.hour, originalEndTime.minutes, originalEndTime.amOrPm)
      const sub = DateUtils.convertTo24Hour(submittedHour, submittedMinute, submittedPeriod)
      return orig.hour !== sub.hour || orig.minute !== sub.minute
    }

    /**
     * Checks if the submitted duration exceeds the original duration for a completed session.
     * Returns error message if validation should throw, or null if valid.
     */
    function validatePastSessionDuration(
      dateStr: string,
      startHour: number,
      startMinute: number,
      startPeriod: 'AM' | 'PM',
      endHour: number,
      endMinute: number,
      endPeriod: 'AM' | 'PM',
      timeFieldThatChanged: 'start' | 'end',
    ): string | null {
      // Check if the session has ended (using end time)
      const shouldValidatePastDuration =
        isSessionEnded ||
        DateFormatUtils.isDateInPast(dateStr) ||
        DateFormatUtils.isSessionEnded(dateStr, endHour, endMinute, endPeriod)

      if (!shouldValidatePastDuration) {
        return null
      }

      const duration = durationInMinutes(startHour, startMinute, startPeriod, endHour, endMinute, endPeriod)
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

      if (originalDurationMinutes !== null && duration > originalDurationMinutes) {
        // Only throw error if the relevant field changed
        const relevantFieldChanged =
          timeFieldThatChanged === 'start'
            ? startTimeChanged(startHour, startMinute, startPeriod)
            : endTimeChanged(endHour, endMinute, endPeriod)
        if (relevantFieldChanged) {
          return errorMessages.sessionSchedule.sessionDetailsDurationLongerThanOriginallyScheduled
        }
      }

      return null
    }

    const dateValidation = body('session-details-date')
      .notEmpty()
      .withMessage(errorMessages.sessionSchedule.sessionDetailsDate)
      .bail()
      .matches(/^(0?[1-9]|[12]\d|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/)
      .withMessage(errorMessages.sessionSchedule.sessionDetailsDateInvalid)

    // Only prevent past dates if the session hasn't ended
    if (!isSessionEnded) {
      dateValidation.bail().custom((value: string) => {
        if (DateFormatUtils.isDateInPast(value)) {
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

          const durationError = validatePastSessionDuration(
            req.body['session-details-date'],
            startHour,
            startMinute,
            startPartOfDay,
            endHour,
            endMinute,
            endPartOfDay,
            'start',
          )
          if (durationError) {
            throw new Error(durationError)
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
        .bail()
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

          if (!isTimeBefore(startHour, startMinute, startPartOfDay, endHour, endMinute, endPartOfDay)) {
            throw new Error(errorMessages.sessionSchedule.sessionDetailsEndTimeBeforeStart)
          }
          const durationError = validatePastSessionDuration(
            req.body['session-details-date'],
            startHour,
            startMinute,
            startPartOfDay,
            endHour,
            endMinute,
            endPartOfDay,
            'end',
          )
          if (durationError) {
            throw new Error(durationError)
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
