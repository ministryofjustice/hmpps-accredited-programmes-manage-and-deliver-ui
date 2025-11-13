import TestUtils from '../../testutils/testUtils'
import RemoveFromGroupForm from './removeFromGroupForm'

describe(`RemoveFromGroupForm `, () => {
  describe('removeFromGroupData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'remove-from-group': 'Yes',
        })
        const data = await new RemoveFromGroupForm(request).removeFromGroupData()

        expect(data.paramsForUpdate).toStrictEqual({
          removeFromGroup: 'Yes',
        })
      })
    })
    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})
        const data = await new RemoveFromGroupForm(request).removeFromGroupData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'remove-from-group',
              formFields: ['remove-from-group'],
              message: 'Select whether you want to remove the person from the group or not',
            },
          ],
        })
      })
    })
  })
})
