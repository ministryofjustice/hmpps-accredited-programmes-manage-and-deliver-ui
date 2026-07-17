import { fakerEN_GB as faker } from '@faker-js/faker'
import { ReferralDetails, ReferralStatusTransitions } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../../services/auditService'
import referralStatusTransitionsFactory from '../../testutils/factories/referralStatusTransitionsFactory'
import TestUtils from '../../testutils/testUtils'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')
jest.mock('../../services/auditService')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralStatusTransitions: ReferralStatusTransitions = referralStatusTransitionsFactory.build()
const referralDetails: ReferralDetails = referralDetailsFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    groupManagementData: {
      groupCode: '`ABC123`',
    },
    originPage: '/group/123/allocations?nameOrCRN=dave',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
})

describe('remove from group', () => {
  describe(`GET /remove-from-group/:groupId/:referralId`, () => {
    it('loads the initial page to remove someone from a group', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .get(`/remove-from-group/${groupId}/${referralId}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Remove Alex River from this group`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'VIEW_REMOVE_FROM_GROUP',
            'user1',
            referralDetails.crn,
            'CRN',
            { referralId: referralId, groupId: groupId },
          )
        })
    })

    it('posts to the remove from group page and redirects successfully to the allocated page with previous filters if No is selected', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/remove-from-group/${groupId}/${referralId}`)
        .type('form')
        .send({
          'remove-from-group': 'No',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/allocations?nameOrCRN=dave`)
        })
        .then(() => {
          expect(sendAuditEvent).not.toHaveBeenCalledWith(
            'VIEW_REMOVE_FROM_GROUP',
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
          )
        })
    })

    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/remove-from-group/${groupId}/${referralId}`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Select whether you want to remove the person from the group or not`)
        })
    })
  })

  describe(`GET /remove-from-group/:groupId/:referralId/update-status`, () => {
    it('loads the initial page to remove someone to a group', async () => {
      accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitionDetails.mockResolvedValue(
        referralStatusTransitions,
      )
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .get(`/remove-from-group/${groupId}/${referralId}/update-status`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Update Alex River&#39;s referral status`)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'VIEW_REMOVE_FROM_GROUP_UPDATE_STATUS',
            'user1',
            referralDetails.crn,
            'CRN',
            expect.objectContaining({ referralId: expect.any(String), groupId: expect.any(String) }),
          )
        })
    })
  })

  describe(`POST remove-from-group/:groupId/:referralId/update-status`, () => {
    it('redirects to the allocated page on successful submit with the API message', async () => {
      const groupId = '123'
      const referralId = '123'
      accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitionDetails.mockResolvedValue(
        referralStatusTransitions,
      )
      accreditedProgrammesManageAndDeliverService.removeFromGroup.mockResolvedValue({
        message: 'John Jones was removed from this group. Their referral status is now Suitable but not ready.',
      })

      return request(app)
        .post(`/remove-from-group/${groupId}/${referralId}/update-status`)
        .type('form')
        .send({
          'updated-status': '336b59cd-b467-4305-8547-6a645a8a3f91',
          'additional-details': 'Some details',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/${groupId}/allocations?message=John%20Jones%20was%20removed%20from%20this%20group.%20Their%20referral%20status%20is%20now%20Suitable%20but%20not%20ready.`,
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'EDIT_REMOVE_FROM_GROUP',
            'user1',
            referralDetails.crn,
            'CRN',
            expect.objectContaining({
              referralId,
              groupId,
              details: expect.objectContaining({
                referralStatusDescriptionId: '336b59cd-b467-4305-8547-6a645a8a3f91',
                additionalDetails: 'Some details',
              }),
            }),
          )
          expect(sendAuditEvent).not.toHaveBeenCalledWith(
            'VIEW_REMOVE_FROM_GROUP_UPDATE_STATUS',
            expect.anything(),
            expect.anything(),
            expect.anything(),
            expect.anything(),
          )
        })
    })
    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'
      accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitionDetails.mockResolvedValue(
        referralStatusTransitions,
      )
      return request(app)
        .post(`/remove-from-group/${groupId}/${referralId}/update-status`)
        .type('form')
        .send({
          'additional-details': faker.string.alpha({ length: 501 }),
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Details must be 500 characters or fewer`)
          expect(res.text).toContain(`Select a new referral status`)
        })
    })
  })
})
