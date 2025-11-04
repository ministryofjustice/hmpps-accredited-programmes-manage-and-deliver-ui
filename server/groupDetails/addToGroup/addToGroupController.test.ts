import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { fakerEN_GB as faker } from '@faker-js/faker'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import { appWithAllRoutes } from '../../routes/testutils/appSetup'

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
  app = appWithAllRoutes({
    services: {
      accreditedProgrammesManageAndDeliverService,
    },
  })
})

describe('add to group', () => {
  describe(`GET /addToGroup/:groupId/:personId`, () => {
    it('loads the initial page to add someone to a group', async () => {
      return request(app)
        .get(`/addToGroup/${randomUUID()}/${randomUUID()}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Add Alex River to this group?`)
        })
    })
  })

  describe(`POST /addToGroup/:groupId/:personId`, () => {
    it('posts to the add to group page and redirects successfully to the more details page if Yes is selected', async () => {
      const groupId = '123'
      const personId = '123'
      return request(app)
        .post(`/addToGroup/${groupId}/${personId}`)
        .type('form')
        .send({
          'add-to-group': 'Yes',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /addToGroup/${groupId}/${personId}/moreDetails`)
        })
    })

    it('posts to the add to group page and redirects successfully to the waitlist page if No is selected', async () => {
      const groupId = '123'
      const personId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${personId}`)
        .type('form')
        .send({
          'add-to-group': 'No',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /groupDetails/${groupId}/waitlist`)
        })
    })

    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const personId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${personId}`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Select whether you want to add the person to the group or not`)
        })
    })
  })

  describe(`GET /addToGroup/:groupId/:personId/moreDetails`, () => {
    it('loads the initial page to add someone to a group', async () => {
      return request(app)
        .get(`/addToGroup/${randomUUID()}/${randomUUID()}/moreDetails`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`referral status will change to Scheduled`)
        })
    })
  })

  describe(`POST /addToGroup/:groupId/:personId/moreDetails`, () => {
    it('redirects to the allocated page on successful submit', async () => {
      const groupId = '123'
      const personId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${personId}/moreDetails`)
        .type('form')
        .send({
          'add-details': 'Some details',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /groupDetails/${groupId}/allocated?addedToGroup=true`)
        })
    })
    it('returns with errors if validation fails', async () => {
      const groupId = '123'
      const personId = '123'

      return request(app)
        .post(`/addToGroup/${groupId}/${personId}/moreDetails`)
        .type('form')
        .send({
          'add-details': faker.string.alpha({ length: 501 }),
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(`Details must be 500 characters or fewer`)
        })
    })
  })
})
