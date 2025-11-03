import GroupForm from './groupForm'
import TestUtils from '../testutils/testUtils'

describe(`GroupForm `, () => {
  describe('addToGroupData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'add-to-group': '123',
        })
        const data = await new GroupForm(request).addToGroupData()

        expect(data.paramsForUpdate).toStrictEqual({
          addToGroup: '123',
        })
      })
    })
    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})
        const data = await new GroupForm(request).addToGroupData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'add-to-group',
              formFields: ['add-to-group'],
              message: 'Select whether you want to add the person to the group or not',
            },
          ],
        })
      })
    })
  })
})
