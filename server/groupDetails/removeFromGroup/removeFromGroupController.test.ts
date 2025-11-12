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
      groupRegion: 'London',
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
