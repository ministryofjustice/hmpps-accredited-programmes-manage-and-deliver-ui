import { faker } from '@faker-js/faker/locale/en_GB'
import AddAvailabilityForm from './AddAvailabilityForm'
import TestUtils from '../../testutils/testUtils'

describe(`AddAvailabilityForm`, () => {
  describe('data', () => {
    describe('when an availability value is passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'availability-checkboxes': 'sunday-daytime',
        })
        const data = await new AddAvailabilityForm(request).data()

        expect(data.paramsForUpdate).toStrictEqual({
          availabilities: [{ label: 'sunday', slots: [{ label: 'daytime', value: true }] }],
          otherDetails: undefined,
        })
      })
    })

    describe('when an multiple availability values are passed and other details are included', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'availability-checkboxes': ['sunday-daytime', 'sunday-evening', 'monday-daytime'],
          'other-availability-details-text-area': 'Some extra information',
        })
        const data = await new AddAvailabilityForm(request).data()

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
        })
      })
    })

    describe('when both availabilities and other details fail validation rules', () => {
      it('returns an error including both fields', async () => {
        const otherDetails = faker.string.alphanumeric(2001)

        const request = TestUtils.createRequest({
          'availability-checkboxes': '',
          'other-availability-details-text-area': otherDetails,
        })
        const data = await new AddAvailabilityForm(request).data()

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
        ])
      })
    })
  })
})
