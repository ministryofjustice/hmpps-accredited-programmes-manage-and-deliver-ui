import { Express } from 'express'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import caselistItem from '../testutils/factories/caselistItem'

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

describe(`GET /pdu/open-referrals`, () => {
  it('calls api to get open referrals', async () => {
    const caseList = caselistItem.build()
    accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(caseList)
    await request(app)
      .get(`/pdu/open-referrals`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Referrals in Brighton and Hove')
      })
  })
})

describe(`GET /pdu/closed-referrals`, () => {
  it('calls api to get open referrals', async () => {
    const caseList = caselistItem.build()
    accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(caseList)
    await request(app)
      .get(`/pdu/closed-referrals`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Referrals in Brighton and Hove')
      })
  })
})
