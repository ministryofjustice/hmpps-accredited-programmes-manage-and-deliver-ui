import TestUtils from '../testutils/testUtils'
import EditSessionForm from './sessionEditForm'

describe('EditSessionForm', () => {
  describe('deleteData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'delete-session': 'yes',
        })

        const data = await new EditSessionForm(request).deleteData()

        expect(data.paramsForUpdate).toStrictEqual({
          delete: 'yes',
        })
        expect(data.error).toBeNull()
      })
    })

    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})

        const data = await new EditSessionForm(request).deleteData()

        expect(data.paramsForUpdate).toBeNull()
        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'delete-session',
              formFields: ['delete-session'],
              message: 'Select whether to delete the session or not',
            },
          ],
        })
      })
    })
  })
})
