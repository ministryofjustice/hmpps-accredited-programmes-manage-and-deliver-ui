import { ReferralCaseListItem } from '@manage-and-deliver-api'
import type { Express } from 'express'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { Page } from '../shared/models/pagination'
import pageFactory from '../testutils/factories/pageFactory'
import referralCaseListItemFactory from '../testutils/factories/referralCaseListItem'
import TestUtils from '../testutils/testUtils'
import { appWithAllRoutes } from './testutils/appSetup'

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
  const referralCaseListItem = referralCaseListItemFactory.build()
  const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
    .pageContent([referralCaseListItem])
    .build() as Page<ReferralCaseListItem>
  accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(referralCaseListItemPage)
  accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(referralCaseListItemPage)
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
