import { fakerEN_GB as faker } from '@faker-js/faker'
import { ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import referralStatusFormDataFactory from '../testutils/factories/referralStatusFormDataFactory'
import statusHistoryFactory from '../testutils/factories/statusHistoryFactory'
import TestUtils from '../testutils/testUtils'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralDetails: ReferralDetails = referralDetailsFactory.build()
const statusDetails = referralStatusFormDataFactory.build()
const statusHistory = statusHistoryFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    originPage: '/referral-details/1/personal-details',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
  accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue(statusDetails)
  accreditedProgrammesManageAndDeliverService.updateStatus.mockResolvedValue({
    referralStatusHistory: statusHistory,
    message: "Jennifer Wilson's referral status is now Awaiting allocation. They have been removed from group BCCDD1",
  })
})
describe('Update Referral Status Controller', () => {
  describe('update-status', () => {
    describe(`GET /referral/:referralDetails.id/update-status`, () => {
      it('loads the update status page', async () => {
        return request(app)
          .get(`/referral/${randomUUID()}/update-status`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
            expect(res.text).toContain(statusDetails.currentStatus.title)
            expect(res.text).toContain(`Update ${referralDetails.personName}'s referral status`)
          })
      })

      it('calls the service with correct parameters', async () => {
        await request(app).get(`/referral/${referralDetails.id}/update-status`).expect(200)
        expect(accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails).toHaveBeenCalledWith(
          referralDetails.id,
          'user1',
        )
      })

      it('handles service errors gracefully', async () => {
        accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockRejectedValue(
          new Error('Service unavailable'),
        )
        return request(app).get(`/referral/${referralDetails.id}/update-status`).expect(500)
      })
    })

    describe(`POST /referral/:referralDetails.id/update-status`, () => {
      it('posts to the update status endpoint and redirects successfully to the correct page', async () => {
        const validId = statusDetails.availableStatuses[0].id
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status`)
          .type('form')
          .send({
            'updated-status': validId,
            'more-details': 'some details',
          })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(
              `Redirecting to /referral/1/status-history?message=Jennifer%20Wilson's%20referral%20status%20is%20now%20Awaiting%20allocation.%20They%20have%20been%20removed%20from%20group%20BCCDD1`,
            )
          })
          .then(() => {
            expect(sendAuditEvent).toHaveBeenCalledWith('EDIT_REFERRAL_STATUS', 'user1', referralDetails.crn, 'CRN', {
              referralId: referralDetails.id,
              updatedStatusId: validId,
            })
          })
      })
      it('handles form errors correctly and displays the appropriate error message', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status`)
          .type('form')
          .send({
            'updated-status': undefined,
            'more-details': 'some details',
          })
          .expect(400)
          .expect(res => {
            expect(res.text).toContain(`Select the referral status you want to move the person to`)
          })
      })
    })
  })
  describe('update-status-interim', () => {
    beforeEach(() => {
      accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue({
        ...statusDetails,
        suggestedStatus: {
          name: 'On programme',
          statusDescriptionId: randomUUID(),
        },
        currentGroupDetails: {
          currentlyAllocatedGroupCode: 'Building Choices 1',
          currentlyAllocatedGroupId: randomUUID(),
        },
      })
    })
    describe(`GET /referral/:referralDetails.id/update-status-interim`, () => {
      it('loads the update status interim page', async () => {
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-scheduled`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
          })
      })
    })
    describe(`POST /referral/:referralDetails.id/update-status-scheduled (or on-programme)`, () => {
      it('redirects to update-status-details if hasStartedOrCompleted is true', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-scheduled`)
          .type('form')
          .send({ 'started-or-completed': 'true' })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(`/referral/${referralDetails.id}/update-status-details`)
          })
      })
      it('redirects to update-status if hasStartedOrCompleted is false', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-on-programme`)
          .type('form')
          .send({ 'started-or-completed': 'false' })
          .expect(302)
          .expect(res => {
            expect(res.text).toContain(`/referral/${referralDetails.id}/update-status`)
          })
      })

      it('returns 400 and displays error if radio buttons are not selected', async () => {
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-on-programme`)
          .type('form')
          .send({})
          .expect(400)
          .expect(res => {
            expect(res.text).toContain('Select whether the person has completed the programme or not')
          })
      })
    })
  })

  describe('update-status-fixed', () => {
    describe(`GET /referral/:referralDetails.id/update-status-details`, () => {
      beforeEach(() => {
        accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue({
          ...statusDetails,
          suggestedStatus: {
            name: 'On programme',
            statusDescriptionId: randomUUID(),
          },
          currentGroupDetails: {
            currentlyAllocatedGroupCode: 'Building Choices 1',
            currentlyAllocatedGroupId: randomUUID(),
          },
        })
      })
      it('loads the update status fixed page for Scheduled', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'Scheduled',
        })
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-scheduled`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
          })
      })

      it('loads the update status fixed page for On programme', async () => {
        accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue({
          ...statusDetails,
          suggestedStatus: {
            ...statusDetails.suggestedStatus,
            name: 'Programme complete',
          },
        })
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'On programme',
        })
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-details`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(referralDetails.crn)
            expect(res.text).toContain(referralDetails.personName)
          })
      })

      it('renders the suggested status id as a hidden form field', async () => {
        const suggestedId = randomUUID()
        accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue({
          ...statusDetails,
          suggestedStatus: { name: 'On programme', statusDescriptionId: suggestedId },
        })
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'Scheduled',
        })
        return request(app)
          .get(`/referral/${referralDetails.id}/update-status-details`)
          .expect(200)
          .expect(res => {
            expect(res.text).toContain(
              `<input type="hidden" name="referral-status-description-id" value="${suggestedId}">`,
            )
          })
      })
    })

    describe(`POST /referral/:referralDetails.id/update-status-details`, () => {
      const suggestedId = 'b3a4c1f0-1111-2222-3333-444455556666'

      beforeEach(() => {
        accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue({
          ...statusDetails,
          suggestedStatus: {
            name: 'On programme',
            statusDescriptionId: suggestedId,
          },
          currentGroupDetails: {
            currentlyAllocatedGroupCode: 'Building Choices 1',
            currentlyAllocatedGroupId: randomUUID(),
          },
        })
      })

      it('updates status using the submitted hidden status id and redirects', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'On programme',
        })
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-details`)
          .type('form')
          .send({ 'referral-status-description-id': suggestedId, 'more-details': 'Some details' })
          .expect(302)
          .expect(() => {
            expect(accreditedProgrammesManageAndDeliverService.updateStatus).toHaveBeenCalledWith(
              'user1',
              referralDetails.id,
              { referralStatusDescriptionId: suggestedId, additionalDetails: 'Some details' },
            )
          })
      })

      it('rejects a submission whose hidden status id is no longer a valid transition (race-condition guard)', async () => {
        // Page was rendered when referral was Scheduled (suggested = On programme = staleId).
        // While the user was on the page, the referral moved on — current transitions now
        // suggest Programme complete and no longer include the stale id.
        const staleId = '00000000-aaaa-bbbb-cccc-deadbeef0001'
        accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails.mockResolvedValue({
          ...statusDetails,
          suggestedStatus: { name: 'Programme complete', statusDescriptionId: randomUUID() },
          availableStatuses: [], // staleId is not present
        })
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-details`)
          .type('form')
          .send({ 'referral-status-description-id': staleId, 'more-details': '' })
          .expect(409)
          .expect(() => {
            expect(accreditedProgrammesManageAndDeliverService.updateStatus).not.toHaveBeenCalled()
          })
      })

      it('renders a friendly inline error when the API returns 400 Invalid referral status transition', async () => {
        accreditedProgrammesManageAndDeliverService.updateStatus.mockRejectedValue({
          status: 400,
          data: {
            status: 400,
            userMessage: "Bad request: Invalid referral status transition: 'Scheduled' -> 'Programme complete'",
          },
        })
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-details`)
          .type('form')
          .send({ 'referral-status-description-id': suggestedId, 'more-details': '' })
          .expect(409)
          .expect(res => {
            expect(res.text).toContain('That referral status change is no longer allowed')
          })
      })

      it('returns 400 and displays error if more-details is too long', async () => {
        accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue({
          ...referralDetails,
          currentStatusDescription: 'Scheduled',
        })
        return request(app)
          .post(`/referral/${referralDetails.id}/update-status-details`)
          .type('form')
          .send({ 'referral-status-description-id': suggestedId, 'more-details': faker.string.alpha({ length: 501 }) })
          .expect(400)
          .expect(res => {
            expect(res.text).toContain('Details must be 500 characters or fewer')
          })
      })
    })
  })

  describe('Cache-Control no-store', () => {
    it('sets Cache-Control: no-store on GET /update-status', async () => {
      const res = await request(app).get(`/referral/${referralDetails.id}/update-status`)
      expect(res.headers['cache-control']).toBe('no-store')
    })
  })

  describe('update-status (radio) race-condition guard', () => {
    it('rejects a submitted status id that is no longer in availableStatuses', async () => {
      return request(app)
        .post(`/referral/${referralDetails.id}/update-status`)
        .type('form')
        .send({ 'updated-status': '00000000-0000-0000-0000-000000000000', 'more-details': '' })
        .expect(409)
        .expect(() => {
          expect(accreditedProgrammesManageAndDeliverService.updateStatus).not.toHaveBeenCalled()
        })
    })

    it('renders a friendly inline error when the API returns 400 Invalid referral status transition', async () => {
      const validId = statusDetails.availableStatuses[0].id
      accreditedProgrammesManageAndDeliverService.updateStatus.mockRejectedValue({
        status: 400,
        data: {
          status: 400,
          userMessage: "Bad request: Invalid referral status transition: 'Awaiting assessment' -> 'Programme complete'",
        },
      })
      return request(app)
        .post(`/referral/${referralDetails.id}/update-status`)
        .type('form')
        .send({ 'updated-status': validId, 'more-details': '' })
        .expect(409)
        .expect(res => {
          expect(res.text).toContain('That referral status change is no longer allowed')
        })
    })
  })
})
