import TestUtils from '../../testutils/testUtils'
import AddAvailabilityDatesForm from './addAvailabilityDatesForm'

describe(`AddAvailabilityForm`, () => {
  const currentDate = new Date().toLocaleDateString('en-GB')
  describe('data', () => {
    describe('when no is selected for end date', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'end-date': 'No',
        })
        const data = await new AddAvailabilityDatesForm(request).data()

        expect(data.paramsForUpdate).toStrictEqual({
          startDate: currentDate,
        })
      })
    })

    describe('when yes is selected for end date and an end date is provided', () => {
      test.each(['01/01/2125', '1/1/2155', '11/1/2125', '1/11/2125', '11/11/2125'])(
        'returns params for update %s',
        async date => {
          const request = TestUtils.createRequest({
            'end-date': 'Yes',
            date,
          })

          const data = await new AddAvailabilityDatesForm(request).data()

          expect(data.paramsForUpdate).toStrictEqual({
            startDate: currentDate,
            endDate: date,
          })
        },
      )
    })

    describe('when yes is selected for end date and an end date is not provided', () => {
      it('returns the correct error', async () => {
        const request = TestUtils.createRequest({
          'end-date': 'Yes',
        })
        const data = await new AddAvailabilityDatesForm(request).data()

        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'date',
            formFields: ['date'],
            message: `Enter a date in the format 17/5/2024 or select the calendar icon to pick a date.`,
          },
        ])
      })
    })

    describe('when yes is selected for end date and an end date is not the correct format', () => {
      test.each(['cheese', '2125/01/01', '2152/1/1', '5th July 2125'])(
        'correctly validates incorrect date %s',
        async date => {
          const request = TestUtils.createRequest({
            'end-date': 'Yes',
            date,
          })

          const data = await new AddAvailabilityDatesForm(request).data()

          expect(data.error?.errors).toStrictEqual([
            {
              errorSummaryLinkedField: 'date',
              formFields: ['date'],
              message: `Enter a date in the format 17/5/2024 or select the calendar icon to pick a date.`,
            },
          ])
        },
      )
    })

    describe('when yes is selected for end date and an end date is today or in the past', () => {
      test.each([currentDate, '01/01/2025'])('correctly validates incorrect date %s', async date => {
        const request = TestUtils.createRequest({
          'end-date': 'Yes',
          date,
        })

        const data = await new AddAvailabilityDatesForm(request).data()

        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'date',
            formFields: ['date'],
            message: `Enter or select a date in the future`,
          },
        ])
      })
    })

    describe('when no option is selected from the radio buttons', () => {
      it('returns the correct error', async () => {
        const request = TestUtils.createRequest({})
        const data = await new AddAvailabilityDatesForm(request).data()

        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'end-date',
            formFields: ['end-date'],
            message: `Select whether the availability details will change on a specific date.`,
          },
        ])
      })
    })
  })
})
