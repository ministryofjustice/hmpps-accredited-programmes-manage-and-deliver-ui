import { fakerEN_GB as faker } from '@faker-js/faker'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../../testutils/testUtils'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    groupManagementData: {
      groupCode: 'ABC123',
      personName: 'Alex River',
    },
    originPage: '/groupOverview/123/waitlist?nameOrCRN=&cohort=General+Offence&sex=&pdu=Liverpool',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.addToGroup.mockResolvedValue({ message: 'Successfully added to group' })
})

describe('add to group', () => {
  describe(`GET /addToGroup/:groupId/:referralId`, () => {
    it('loads the initial page to add someone to a group', async () => {
      return request(app)
        .get(`/addToGroup/${randomUUID()}/${randomUUID()}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Add Alex River to this group?`)
        })
    })
  })

  describe(`POST /addToGroup/:groupId/:referralId`, () => {
    it('posts to the add to group page and redirects successfully to the more details page if Yes is selected', async () => {
      const groupId = '123'
      const referralId = '123'
      return request(app)
        .post(`/addToGroup/${groupId}/${referralId}`)
        .type('form')
        .send({
          'add-to-group': 'Yes',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /addToGroup/${groupId}/${referralId}/moreDetails`)
        })
    })

    it('posts to the add to group page and redirects successfully to the waitlist page with previous filters if No is selected', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${referralId}`)
        .type('form')
        .send({
          'add-to-group': 'No',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /groupOverview/${groupId}/waitlist?nameOrCRN=&cohort=General+Offence&sex=&pdu=Liverpool`,
          )
        })
    })

    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${referralId}`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Select whether you want to add the person to the group or not`)
        })
    })
  })

  describe(`GET /addToGroup/:groupId/:referralId/moreDetails`, () => {
    it('loads the initial page to add someone to a group', async () => {
      return request(app)
        .get(`/addToGroup/${randomUUID()}/${randomUUID()}/moreDetails`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`referral status will change to Scheduled`)
        })
    })
  })

  describe(`POST /addToGroup/:groupId/:referralId/moreDetails`, () => {
    it('redirects to the allocated page on successful submit with the API message', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${referralId}/moreDetails`)
        .type('form')
        .send({
          'additional-details': 'Some details',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/${groupId}/allocated?message=Successfully%20added%20to%20group`,
          )
        })
    })
    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const referralId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${referralId}/moreDetails`)
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
