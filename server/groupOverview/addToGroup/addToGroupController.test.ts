import { fakerEN_GB as faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../../testutils/testUtils'
import referralDetailsFactory from '../../testutils/factories/referralDetailsFactory'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralDetails: ReferralDetails = referralDetailsFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    groupManagementData: {
      groupCode: 'ABC123',
    },
    originPage: '/group/123/waitlist?nameOrCRN=&cohort=General+Offence&sex=&pdu=Liverpool',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.addToGroup.mockResolvedValue({ message: 'Successfully added to group' })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
})

describe('add to group', () => {
  describe(`GET /add-to-group/:groupId/:referralId`, () => {
    it('loads the initial page to add someone to a group', async () => {
      return request(app)
        .get(`/add-to-group/${randomUUID()}/${randomUUID()}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Add Alex River to this group?`)
        })
    })
  })

  describe(`POST /add-to-group/:groupId/:referralId`, () => {
    it('posts to the add to group page and redirects successfully to the more details page if Yes is selected', async () => {
      const groupId = '123'
      const referralId = '123'
      return request(app)
        .post(`/add-to-group/${groupId}/${referralId}`)
        .type('form')
        .send({
          'add-to-group': 'Yes',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /${groupId}/${referralId}/scheduled-status-details`)
        })
    })

    it('posts to the add to group page and redirects successfully to the waitlist page with previous filters if No is selected', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/add-to-group/${groupId}/${referralId}`)
        .type('form')
        .send({
          'add-to-group': 'No',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/${groupId}/waitlist?nameOrCRN=&cohort=General+Offence&sex=&pdu=Liverpool`,
          )
        })
    })

    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/add-to-group/${groupId}/${referralId}`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Select whether you want to add the person to the group or not`)
        })
    })
  })

  describe(`GET /:groupId/:referralId/scheduled-status-details`, () => {
    it('loads the initial page to add someone to a group', async () => {
      return request(app)
        .get(`/${randomUUID()}/${randomUUID()}/scheduled-status-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`referral status will change to Scheduled`)
        })
    })
  })

  describe(`POST /:groupId/:referralId/scheduled-status-details`, () => {
    it('redirects to the allocated page on successful submit with the API message', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/${groupId}/${referralId}/scheduled-status-details`)
        .type('form')
        .send({
          'additional-details': 'Some details',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/${groupId}/allocations?message=Successfully%20added%20to%20group`,
          )
        })
    })
    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/${groupId}/${referralId}/scheduled-status-details`)
        .type('form')
        .send({
          'additional-details': faker.string.alpha({ length: 501 }),
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Details must be 500 characters or fewer`)
        })
    })
  })
})
