import { fakerEN_GB as faker } from '@faker-js/faker'
import AddToGroupForm from './addToGroupForm'
import TestUtils from '../../testutils/testUtils'

describe(`AddToGroupForm `, () => {
  describe('addToGroupData', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'add-to-group': 'Yes',
        })
        const data = await new AddToGroupForm(request).addToGroupData()

        expect(data.paramsForUpdate).toStrictEqual({
          addToGroup: 'Yes',
        })
      })
    })
    describe('when mandatory fields are missing', () => {
      it('returns an appropriate error', async () => {
        const request = TestUtils.createRequest({})
        const data = await new AddToGroupForm(request).addToGroupData()

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
  describe('addToGroupMoreDetailsData', () => {
    describe('when no additional details are given', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({})
        const data = await new AddToGroupForm(request).addToGroupMoreDetailsData()

        expect(data.paramsForUpdate).toStrictEqual({ moreDetails: undefined })
      })
    })
    describe('when additional details are given', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'add-details': 'Some details to add',
        })
        const data = await new AddToGroupForm(request).addToGroupMoreDetailsData()

        expect(data.paramsForUpdate).toStrictEqual({
          moreDetails: 'Some details to add',
        })
      })
      it('validates correctly and returns an appropriate error message', async () => {
        const request = TestUtils.createRequest({
          'add-details': faker.string.alpha({ length: 501 }),
        })
        const data = await new AddToGroupForm(request).addToGroupMoreDetailsData()

        expect(data.error).toStrictEqual({
          errors: [
            {
              errorSummaryLinkedField: 'add-details',
              formFields: ['add-details'],
              message: 'Details must be 500 characters or fewer',
            },
          ],
        })
      })
    })
  })
})
