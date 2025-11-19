import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import { ReferralStatusTransitions } from '@manage-and-deliver-api'
import { fakerEN_GB as faker } from '@faker-js/faker'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../../testutils/testUtils'
import referralStatusTransitionsFactory from '../../testutils/factories/referralStatusTransitionsFactory'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralStatusTransitions: ReferralStatusTransitions = referralStatusTransitionsFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    groupManagementData: {
      groupCode: '`ABC123`',
      personName: 'Alex River',
    },
    originPage: '/groupDetails/123/allocated?nameOrCRN=dave',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
})

describe('remove from group', () => {
  describe(`GET /removeFromGroup/:groupId/:referralId`, () => {
    it('loads the initial page to remove someone from a group', async () => {
      return request(app)
        .get(`/removeFromGroup/${randomUUID()}/${randomUUID()}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Remove Alex River from this group`)
        })
    })

    it('posts to the remove from group page and redirects successfully to the allocated page with previous filters if No is selected', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/removeFromGroup/${groupId}/${referralId}`)
        .type('form')
        .send({
          'remove-from-group': 'No',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /groupDetails/${groupId}/allocated?nameOrCRN=dave`)
        })
    })

    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/removeFromGroup/${groupId}/${referralId}`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Select whether you want to remove the person from the group or not`)
        })
    })
  })

  describe(`GET /removeFromGroup/:groupId/:referralId/updateStatus`, () => {
    it('loads the initial page to remove someone to a group', async () => {
      accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitions.mockResolvedValue(
        referralStatusTransitions,
      )
      return request(app)
        .get(`/removeFromGroup/${randomUUID()}/${randomUUID()}/updateStatus`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Update Alex River&#39;s referral status`)
        })
    })
  })

  describe(`POST removeFromGroup/:groupId/:referralId/updateStatus`, () => {
    it('redirects to the allocated page on successful submit with the API message', async () => {
      const groupId = '123'
      const referralId = '123'
      accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitions.mockResolvedValue(
        referralStatusTransitions,
      )
      accreditedProgrammesManageAndDeliverService.removeFromGroup.mockResolvedValue({
        message: 'John Jones was removed from this group. Their referral status is now Suitable but not ready.',
      })

      return request(app)
        .post(`/removeFromGroup/${groupId}/${referralId}/updateStatus`)
        .type('form')
        .send({
          'updated-status': '336b59cd-b467-4305-8547-6a645a8a3f91',
          'additional-details': 'Some details',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /groupDetails/${groupId}/allocated?message=John%20Jones%20was%20removed%20from%20this%20group.%20Their%20referral%20status%20is%20now%20Suitable%20but%20not%20ready.`,
          )
        })
    })
    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'
      accreditedProgrammesManageAndDeliverService.removeFromGroupStatusTransitions.mockResolvedValue(
        referralStatusTransitions,
      )
      return request(app)
        .post(`/removeFromGroup/${groupId}/${referralId}/updateStatus`)
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
