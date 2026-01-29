import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sessionDetailsFactory from '../testutils/factories/risksAndNeeds/sessionDetailsFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

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

describe('editSession', () => {
  it('should fetch session details with correct parameters', async () => {
    const sessionDetails = sessionDetailsFactory.build()
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app).get(`/group/12345/sessionId/6789/test-session`).expect(200)

    expect(accreditedProgrammesManageAndDeliverService.getGroupSessionDetails).toHaveBeenCalledWith(
      'user1',
      '12345',
      '6789',
    )
  })

  it('loads the session details page and displays all related data', async () => {
    const sessionDetails = sessionDetailsFactory.build()
    accreditedProgrammesManageAndDeliverService.getGroupSessionDetails.mockResolvedValue(sessionDetails)

    await request(app)
      .get(`/group/12345/sessionId/6789/test-session`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Test Session')
        expect(res.text).toContain('15 March 2025')
        expect(res.text).toContain('9:30am to midday')
      })
  })
})
