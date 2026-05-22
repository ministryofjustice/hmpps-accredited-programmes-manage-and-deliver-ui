import TestUtils from '../../testutils/testUtils'
import EditSessionDateAndTimeFormForm from './editSessionDateAndTimeForm'

describe('EditSessionDateAndTimeForm', () => {
  const request = TestUtils.createRequest({})

  describe('rescheduleSessionDetailsData', () => {
    describe('when validation passes', () => {
      beforeEach(() => {
        request.body = {
          'session-details-date': '15/12/3055',
          'session-details-start-time-hour': '10',
          'session-details-start-time-minute': '30',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '11',
          'session-details-end-time-minute': '45',
          'session-details-end-time-part-of-day': 'AM',
        }
      })

      it('returns params for update with parsed values', async () => {
        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.paramsForUpdate).toEqual({
          sessionStartDate: '15/12/3055',
          sessionStartTime: {
            hour: 10,
            minutes: 30,
            amOrPm: 'AM',
          },
          sessionEndTime: {
            hour: 11,
            minutes: 45,
            amOrPm: 'AM',
          },
        })
        expect(data.error).toBeNull()
      })
    })

    describe('validation', () => {
      beforeEach(() => {
        request.body = {
          'session-details-date': '',
          'session-details-start-time-hour': '10',
          'session-details-start-time-minute': '30',
          'session-details-start-time-part-of-day': 'AM',
          'session-details-end-time-hour': '11',
          'session-details-end-time-minute': '45',
          'session-details-end-time-part-of-day': 'AM',
        }
      })

      it('returns error when data is missing', async () => {
        request.body['session-details-date'] = ''
        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()
        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-date',
              formFields: ['session-details-date'],
              message: 'Enter or select a date',
            },
          ],
        })
      })

      it('returns error when date format is invalid', async () => {
        request.body['session-details-date'] = '2024-12-15'

        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-date',
              formFields: ['session-details-date'],
              message: 'Enter a date in the format 10/7/2025',
            },
          ],
        })
      })

      it('returns error when date is in the past', async () => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        request.body['session-details-date'] =
          `${yesterday.getDate()}/${yesterday.getMonth() + 1}/${yesterday.getFullYear()}`

        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-date',
              formFields: ['session-details-date'],
              message: 'Start date must be in the future',
            },
          ],
        })
      })
    })

    describe('time validation', () => {
      beforeEach(() => {
        request.body = {
          'session-details-date': '12/12/3055',
          'session-details-end-time-hour': '11',
          'session-details-end-time-minute': '45',
          'session-details-end-time-part-of-day': 'AM',
        }
      })

      it('returns error when start hour and start AM/PM is missing', async () => {
        request.body['session-details-start-time-hour'] = ''
        request.body['session-details-start-time-minute'] = '30'

        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-start-time-hour',
              formFields: ['session-details-start-time-hour'],
              message: 'Enter a complete start time',
            },
            {
              errorSummaryLinkedField: 'session-details-start-time-part-of-day',
              formFields: ['session-details-start-time-part-of-day'],
              message: 'Select whether the start time is am or pm',
            },
          ],
        })
      })

      it('returns error when start hour and minute is less than 1', async () => {
        request.body['session-details-start-time-hour'] = '0'
        request.body['session-details-start-time-minute'] = '-1'
        request.body['session-details-start-time-part-of-day'] = 'AM'

        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-start-time-hour',
              formFields: ['session-details-start-time-hour'],
              message: 'Enter an hour between 1 and 12',
            },
            {
              errorSummaryLinkedField: 'session-details-start-time-minute',
              formFields: ['session-details-start-time-minute'],
              message: 'Enter a minute between 00 and 59',
            },
          ],
        })
      })

      it('returns error when start hour is greater than 12 and minutes are greater than 59', async () => {
        request.body['session-details-start-time-hour'] = '13'
        request.body['session-details-start-time-minute'] = '60'
        request.body['session-details-start-time-part-of-day'] = 'AM'

        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-start-time-hour',
              formFields: ['session-details-start-time-hour'],
              message: 'Enter an hour between 1 and 12',
            },
            {
              errorSummaryLinkedField: 'session-details-start-time-minute',
              formFields: ['session-details-start-time-minute'],
              message: 'Enter a minute between 00 and 59',
            },
          ],
        })
      })

      it('returns error when end hour and end AM/PM is missing', async () => {
        request.body['session-details-start-time-hour'] = '12'
        request.body['session-details-start-time-minute'] = '59'
        request.body['session-details-start-time-part-of-day'] = 'AM'
        request.body['session-details-end-time-hour'] = ''
        request.body['session-details-end-time-minute'] = '30'
        request.body['session-details-end-time-part-of-day'] = ''

        const data = await new EditSessionDateAndTimeFormForm(request).rescheduleSessionDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'session-details-end-time-hour',
              formFields: ['session-details-end-time-hour'],
              message: 'Enter a complete end time',
            },
            {
              errorSummaryLinkedField: 'session-details-end-time-part-of-day',
              formFields: ['session-details-end-time-part-of-day'],
              message: 'Select whether the end time is am or pm',
            },
          ],
        })
      })
    })
  })

  describe('when session is in the past', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const pastDate = `${yesterday.getDate()}/${yesterday.getMonth() + 1}/${yesterday.getFullYear()}`

    beforeEach(() => {
      request.body = {
        'session-details-date': pastDate,
        'session-details-start-time-hour': '10',
        'session-details-start-time-minute': '0',
        'session-details-start-time-part-of-day': 'AM',
        'session-details-end-time-hour': '12',
        'session-details-end-time-minute': '30',
        'session-details-end-time-part-of-day': 'PM',
      }
    })

    it('accepts a past date without error', async () => {
      const data = await new EditSessionDateAndTimeFormForm(request, true).rescheduleSessionDetailsData()
      expect(data.error).toBeNull()
    })

    it('accepts a duration equal to the original duration', async () => {
      const originalStart = { hour: 10, minutes: 0, amOrPm: 'AM' as const }
      const originalEnd = { hour: 12, minutes: 30, amOrPm: 'PM' as const } // 150 mins
      // Submit same duration but shifted (start earlier, end earlier by same amount)
      request.body['session-details-start-time-hour'] = '9'
      request.body['session-details-start-time-minute'] = '0'
      request.body['session-details-start-time-part-of-day'] = 'AM'
      request.body['session-details-end-time-hour'] = '11'
      request.body['session-details-end-time-minute'] = '30'
      request.body['session-details-end-time-part-of-day'] = 'AM'

      const data = await new EditSessionDateAndTimeFormForm(
        request,
        true,
        originalStart,
        originalEnd,
      ).rescheduleSessionDetailsData()
      expect(data.error).toBeNull()
    })

    it('returns error when submitted duration exceeds original duration', async () => {
      const originalStart = { hour: 10, minutes: 0, amOrPm: 'AM' as const }
      const originalEnd = { hour: 12, minutes: 30, amOrPm: 'PM' as const } // 150 mins
      request.body['session-details-start-time-hour'] = '10'
      request.body['session-details-start-time-minute'] = '0'
      request.body['session-details-start-time-part-of-day'] = 'AM'
      request.body['session-details-end-time-hour'] = '12'
      request.body['session-details-end-time-minute'] = '31'
      request.body['session-details-end-time-part-of-day'] = 'PM'

      const data = await new EditSessionDateAndTimeFormForm(
        request,
        true,
        originalStart,
        originalEnd,
      ).rescheduleSessionDetailsData()

      expect(data.paramsForUpdate).toBeNull()
      expect(data.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            errorSummaryLinkedField: 'session-details-end-time-hour',
            message: 'The session duration cannot be longer than originally scheduled. Change the start or end time.',
          }),
        ]),
      )
    })

    it('does not check duration when session is not in the past', async () => {
      request.body['session-details-date'] = '15/12/3055'
      request.body['session-details-start-time-hour'] = '10'
      request.body['session-details-start-time-minute'] = '0'
      request.body['session-details-start-time-part-of-day'] = 'AM'
      request.body['session-details-end-time-hour'] = '1'
      request.body['session-details-end-time-minute'] = '0'
      request.body['session-details-end-time-part-of-day'] = 'PM'

      const data = await new EditSessionDateAndTimeFormForm(request, false).rescheduleSessionDetailsData()
      expect(data.error).toBeNull()
    })

    it('checks duration when submitted date is past even if session flag is false', async () => {
      const originalStart = { hour: 10, minutes: 0, amOrPm: 'AM' as const }
      const originalEnd = { hour: 12, minutes: 30, amOrPm: 'PM' as const } // 150 mins
      request.body['session-details-date'] = pastDate
      request.body['session-details-start-time-hour'] = '10'
      request.body['session-details-start-time-minute'] = '0'
      request.body['session-details-start-time-part-of-day'] = 'AM'
      request.body['session-details-end-time-hour'] = '12'
      request.body['session-details-end-time-minute'] = '31'
      request.body['session-details-end-time-part-of-day'] = 'PM'

      const data = await new EditSessionDateAndTimeFormForm(
        request,
        false,
        originalStart,
        originalEnd,
      ).rescheduleSessionDetailsData()
      expect(data.error?.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            errorSummaryLinkedField: 'session-details-end-time-hour',
            message: 'The session duration cannot be longer than originally scheduled. Change the start or end time.',
          }),
        ]),
      )
    })

    describe('error shown on the correct field based on what changed', () => {
      const originalStart = { hour: 10, minutes: 0, amOrPm: 'AM' as const }
      const originalEnd = { hour: 12, minutes: 30, amOrPm: 'PM' as const }

      beforeEach(() => {
        request.body['session-details-date'] = pastDate
      })

      it('shows error on start time only when only start time was changed to create long duration', async () => {
        // Move start earlier to create >2.5h duration; end stays the same
        request.body['session-details-start-time-hour'] = '9'
        request.body['session-details-start-time-minute'] = '0'
        request.body['session-details-start-time-part-of-day'] = 'AM'
        request.body['session-details-end-time-hour'] = '12'
        request.body['session-details-end-time-minute'] = '30'
        request.body['session-details-end-time-part-of-day'] = 'PM'

        const data = await new EditSessionDateAndTimeFormForm(
          request,
          true,
          originalStart,
          originalEnd,
        ).rescheduleSessionDetailsData()
        const fields = data.error?.errors.map(e => e.errorSummaryLinkedField) ?? []
        expect(fields).toContain('session-details-start-time-hour')
        expect(fields).not.toContain('session-details-end-time-hour')
      })

      it('shows error on end time only when only end time was changed to create long duration', async () => {
        // Keep start the same; move end later to create >2.5h duration
        request.body['session-details-start-time-hour'] = '10'
        request.body['session-details-start-time-minute'] = '0'
        request.body['session-details-start-time-part-of-day'] = 'AM'
        request.body['session-details-end-time-hour'] = '1'
        request.body['session-details-end-time-minute'] = '0'
        request.body['session-details-end-time-part-of-day'] = 'PM'

        const data = await new EditSessionDateAndTimeFormForm(
          request,
          true,
          originalStart,
          originalEnd,
        ).rescheduleSessionDetailsData()
        const fields = data.error?.errors.map(e => e.errorSummaryLinkedField) ?? []
        expect(fields).toContain('session-details-end-time-hour')
        expect(fields).not.toContain('session-details-start-time-hour')
      })

      it('shows error on both fields when both times were changed to create long duration', async () => {
        // Move start earlier AND end later
        request.body['session-details-start-time-hour'] = '9'
        request.body['session-details-start-time-minute'] = '0'
        request.body['session-details-start-time-part-of-day'] = 'AM'
        request.body['session-details-end-time-hour'] = '1'
        request.body['session-details-end-time-minute'] = '0'
        request.body['session-details-end-time-part-of-day'] = 'PM'

        const data = await new EditSessionDateAndTimeFormForm(
          request,
          true,
          originalStart,
          originalEnd,
        ).rescheduleSessionDetailsData()
        const fields = data.error?.errors.map(e => e.errorSummaryLinkedField) ?? []
        expect(fields).toContain('session-details-start-time-hour')
        expect(fields).toContain('session-details-end-time-hour')
      })
    })
  })
})
