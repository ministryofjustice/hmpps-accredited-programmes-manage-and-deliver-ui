import EditSessionDateAndTimeFormForm from './editSessionDateAndTimeForm'
import TestUtils from '../../testutils/testUtils'

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
})
