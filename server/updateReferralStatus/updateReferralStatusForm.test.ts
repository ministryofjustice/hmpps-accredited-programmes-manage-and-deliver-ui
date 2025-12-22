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
        const data = await new UpdateReferralStatusForm(request).data('Awaiting allocation')

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
        const data = await new UpdateReferralStatusForm(request).data('Awaiting allocation')

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
        const data = await new UpdateReferralStatusForm(request).data('Awaiting allocation')
        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'more-details',
            formFields: ['more-details'],
            message: 'Details must be 500 characters or fewer',
          },
          {
            errorSummaryLinkedField: 'updated-status',
            formFields: ['updated-status'],
            message: `Select the referral status you want to move the person to`,
          },
        ])
      })
      it('returns an correct error for scheduled', async () => {
        const request = TestUtils.createRequest({
          'updated-status': undefined,
        })
        const data = await new UpdateReferralStatusForm(request).data('Scheduled')
        expect(data.error?.errors).toStrictEqual([
          {
            errorSummaryLinkedField: 'updated-status',
            formFields: ['updated-status'],
            message: `Select a new referral status`,
          },
        ])
      })
    })
  })
  describe('interimData', () => {
    describe('when started-or-completed is provided', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'started-or-completed': 'yes',
        })
        const data = await new UpdateReferralStatusForm(request).startedOrCompletedData('Scheduled')

        expect(data.paramsForUpdate).toStrictEqual({
          hasStartedOrCompleted: 'yes',
        })
      })
    })

    describe('when started-or-completed is missing', () => {
      it('returns an error for missing started-or-completed (Scheduled)', async () => {
        const request = TestUtils.createRequest({})
        const data = await new UpdateReferralStatusForm(request).startedOrCompletedData('Scheduled')

        expect(data.error?.errors).toContainEqual({
          errorSummaryLinkedField: 'started-or-completed',
          formFields: ['started-or-completed'],
          message: 'Select whether the person has started the programme or not',
        })
      })

      it('returns an error for missing started-or-completed (Completed)', async () => {
        const request = TestUtils.createRequest({})
        const data = await new UpdateReferralStatusForm(request).startedOrCompletedData('Completed')

        expect(data.error?.errors).toContainEqual({
          errorSummaryLinkedField: 'started-or-completed',
          formFields: ['started-or-completed'],
          message: 'Select whether the person has completed the programme or not',
        })
      })
    })
  })

  describe('fixedData', () => {
    describe('when more-details is valid', () => {
      it('returns params for update', async () => {
        const request = TestUtils.createRequest({
          'more-details': 'Some details',
        })
        const data = await new UpdateReferralStatusForm(request).fixedData()

        expect(data.paramsForUpdate).toStrictEqual({
          additionalDetails: 'Some details',
        })
      })
    })

    describe('when more-details is too long', () => {
      it('returns an error for too long more-details', async () => {
        const longDetails = faker.string.alphanumeric(501)
        const request = TestUtils.createRequest({
          'more-details': longDetails,
        })
        const data = await new UpdateReferralStatusForm(request).fixedData()

        expect(data.error?.errors).toContainEqual({
          errorSummaryLinkedField: 'more-details',
          formFields: ['more-details'],
          message: 'Details must be 500 characters or fewer',
        })
      })
    })
  })
})
