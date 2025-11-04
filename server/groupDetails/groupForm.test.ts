import GroupForm from './groupForm'
import TestUtils from '../testutils/testUtils'

describe(`GroupForm `, () => {
  describe('addToGroupData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'add-to-group': 'Alex River*123',
        })
        const data = await new GroupForm(request).addToGroupData()

        expect(data.paramsForUpdate).toStrictEqual({
          personName: 'Alex River',
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
              message: "Select the button next to a person's name to add them to the group",
            },
          ],
        })
      })
    })
  })
})
