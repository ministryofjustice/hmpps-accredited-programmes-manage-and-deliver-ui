import { CaseListReferrals } from '@manage-and-deliver-api'
import type { Express } from 'express'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../testutils/testUtils'
import { appWithAllRoutes } from './testutils/appSetup'
import caseListReferralsFactory from '../testutils/factories/caseListReferralsFactory'

const hmppsAuthClientBuilder = jest.fn()
jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      accreditedProgrammesManageAndDeliverService,
    },
  })
  const caseListReferrals: CaseListReferrals = caseListReferralsFactory.build()
  accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(caseListReferrals)
  accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(caseListReferrals)
  accreditedProgrammesManageAndDeliverService.getCaseListFilters.mockResolvedValue(TestUtils.createCaseListFilters())
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('GET /', () => {
  it('should render case list page', () => {
    return request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('Open referrals')
      })
  })
})
