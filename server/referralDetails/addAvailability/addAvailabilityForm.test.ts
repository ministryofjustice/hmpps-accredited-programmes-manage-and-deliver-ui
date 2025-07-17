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

        expect(data.paramsForUpdate).toEqual('sunday-daytime')
      })
    })

    describe('when no availability value is passed', () => {
      it('returns an error', async () => {
        const request = TestUtils.createRequest({
          'availability-checkboxes': '',
        })
        const data = await new AddAvailabilityForm(request).data()

        expect(data.error?.errors).toContainEqual({
          errorSummaryLinkedField: 'availability-checkboxes',
          formFields: ['availability-checkboxes'],
          message: 'Need to confirm error message.',
        })
      })
    })
  })
})
