import { fakerEN_GB as faker } from '@faker-js/faker'
import AddAvailabilityForm from './AddAvailabilityForm'
import TestUtils from '../../testutils/testUtils'

describe(`AddAvailabilityForm`, () => {
  describe('data', () => {
    const currentDate = new Date().toISOString().split('T')[0]
    const referralId = faker.string.uuid()
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'availability-checkboxes': 'sunday-daytime',
          'end-date': 'No',
        })
        const data = await new AddAvailabilityForm(request, referralId).data()

        expect(data.paramsForUpdate).toStrictEqual({
          availabilities: [{ label: 'sunday', slots: [{ label: 'daytime', value: true }] }],
          otherDetails: undefined,
          startDate: currentDate,
          referralId,
        })
      })
    })

    describe('when an multiple availability values are passed and other details are included', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'availability-checkboxes': ['sunday-daytime', 'sunday-evening', 'monday-daytime'],
          'other-availability-details-text-area': 'Some extra information',
          'end-date': 'No',
        })
        const data = await new AddAvailabilityForm(request, referralId).data()

        expect(data.paramsForUpdate).toStrictEqual({
          availabilities: [
            {
              label: 'sunday',
              slots: [
                { label: 'daytime', value: true },
                { label: 'evening', value: true },
              ],
            },
            { label: 'monday', slots: [{ label: 'daytime', value: true }] },
          ],
          otherDetails: 'Some extra information',
          startDate: currentDate,
          referralId,
        })
      })
    })

    describe('when both availabilities, other details, and date radio fail validation rules', () => {
      it('returns an error including both fields', async () => {
        const otherDetails = faker.string.alphanumeric(2001)

        const request = TestUtils.createRequest({
          'availability-checkboxes': '',
          'other-availability-details-text-area': otherDetails,
        })
        const data = await new AddAvailabilityForm(request, referralId).data()

        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'availability-checkboxes',
            formFields: ['availability-checkboxes'],
            message: `Select times the person is available or select 'cancel'.`,
          },
          {
            errorSummaryLinkedField: 'other-availability-details-text-area',
            formFields: ['other-availability-details-text-area'],
            message: 'Availability details must be 2,000 characters or fewer.',
          },
          {
            errorSummaryLinkedField: 'end-date',
            formFields: ['end-date'],
            message: 'Select whether the availability details will change on a specific date.',
          },
        ])
      })
    })

    describe('when yes is selected for end date and an end date is provided', () => {
      const testCases = [
        { input: '01/01/2125', expectedResult: '2125-01-01' },
        { input: '1/1/2155', expectedResult: '2155-01-01' },
        { input: '11/1/2125', expectedResult: '2125-01-11' },
        { input: '1/11/2125', expectedResult: '2125-11-01' },
        { input: '11/11/2125', expectedResult: '2125-11-11' },
      ]

      test.each(testCases)(
        'returns params for update, correctly converting "$input" to "$expectedResult"',
        async ({ input, expectedResult }) => {
          const request = TestUtils.createRequest({
            'availability-checkboxes': 'sunday-daytime',
            'end-date': 'Yes',
            date: input,
          })

          const data = await new AddAvailabilityForm(request, referralId).data()

          expect(data.paramsForUpdate).toStrictEqual({
            availabilities: [{ label: 'sunday', slots: [{ label: 'daytime', value: true }] }],
            otherDetails: undefined,
            startDate: currentDate,
            endDate: expectedResult,
            referralId,
          })
        },
      )
    })

    describe('when yes is selected for end date and an end date is not provided', () => {
      it('returns the correct error', async () => {
        const request = TestUtils.createRequest({
          'availability-checkboxes': 'sunday-daytime',
          'end-date': 'Yes',
        })
        const data = await new AddAvailabilityForm(request, referralId).data()

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
            'availability-checkboxes': 'sunday-daytime',
            'end-date': 'Yes',
            date,
          })

          const data = await new AddAvailabilityForm(request, referralId).data()

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
      test.each([new Date().toLocaleDateString('en-GB'), '01/01/2025'])(
        'correctly validates incorrect date %s',
        async date => {
          const request = TestUtils.createRequest({
            'availability-checkboxes': 'sunday-daytime',
            'end-date': 'Yes',
            date,
          })

          const data = await new AddAvailabilityForm(request, referralId).data()

          expect(data.error?.errors).toStrictEqual([
            {
              errorSummaryLinkedField: 'date',
              formFields: ['date'],
              message: `Enter or select a date in the future`,
            },
          ])
        },
      )
    })
  })
})
