import { ReferralCaseListItem } from '@manage-and-deliver-api'
import * as cheerio from 'cheerio'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { Page } from '../shared/models/pagination'
import pageFactory from '../testutils/factories/pageFactory'
import referralCaseListItemFactory from '../testutils/factories/referralCaseListItem'

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
  const referralCaseListItem = referralCaseListItemFactory.build()
  const referralCaseListItemPage: Page<ReferralCaseListItem> = pageFactory
    .pageContent([referralCaseListItem])
    .build() as Page<ReferralCaseListItem>
  accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(referralCaseListItemPage)
  accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(referralCaseListItemPage)
})

describe(`Caselist controller`, () => {
  test.each([
    ['/pdu/open-referrals?cohort=sexual-offence&referralStatus=court-order', 'sexual-offence', 'court-order'],
    [`/pdu/open-referrals`, undefined, undefined],
    ['/pdu/closed-referrals', undefined, undefined],
    [
      '/pdu/open-referrals?cohort=general-offence&referralStatus=programme-complete',
      'general-offence',
      'programme-complete',
    ],
  ])(
    `should set the correct filters based on the url provided %s`,
    async (url: string, cohortValue, referralStatusValue) => {
      await request(app)
        .get(url)
        .expect(200)
        .expect(res => {
          expect(res.ok)
          const $ = cheerio.load(res.text)
          const cohortInput = $('#cohort option[selected]').val()
          expect(cohortInput).toBe(cohortValue)
          const referralStatusInput = $('#referralStatus option[selected]').val()
          expect(referralStatusInput).toBe(referralStatusValue)
        })
    },
  )
})
