import { fakerEN_GB as faker } from '@faker-js/faker'
import TestUtils from '../testutils/testUtils'
import UpdateReferralStatusForm from './updateReferralStatusForm'

describe(`UpdateReferralStatusForm`, () => {
  describe('data', () => {
    describe('when all mandatory fields are passed', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'updated-status': 'afc0b94c-b983-4a68-a109-0be29a7d3b2f',
          'more-details': 'Person breached their conditions',
        })
        const data = await new UpdateReferralStatusForm(request).data()

        expect(data.paramsForUpdate).toStrictEqual({
          referralStatusDescriptionId: 'afc0b94c-b983-4a68-a109-0be29a7d3b2f',
          additionalDetails: 'Person breached their conditions',
        })
      })
      it('returns params for update when more details has not been filled', async () => {
        const request = TestUtils.createRequest({
          'updated-status': 'afc0b94c-b983-4a68-a109-0be29a7d3b2f',
          'more-details': '',
        })
        const data = await new UpdateReferralStatusForm(request).data()

        expect(data.paramsForUpdate).toStrictEqual({
          referralStatusDescriptionId: 'afc0b94c-b983-4a68-a109-0be29a7d3b2f',
          additionalDetails: '',
        })
      })
    })
    describe('when both updated status and more details fail validation rules', () => {
      it('returns an error including both fields', async () => {
        const moreDetails = faker.string.alphanumeric(501)

        const request = TestUtils.createRequest({
          'updated-status': undefined,
          'more-details': moreDetails,
        })
        const data = await new UpdateReferralStatusForm(request).data()
        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'more-details',
            formFields: ['more-details'],
            message: 'Details must be 500 characters or fewer.',
          },
          {
            errorSummaryLinkedField: 'updated-status',
            formFields: ['updated-status'],
            message: `Select the referral status you want to move the person to.`,
          },
        ])
      })
    })
  })
})
