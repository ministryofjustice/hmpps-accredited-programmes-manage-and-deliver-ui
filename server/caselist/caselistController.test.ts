import { Express } from 'express'
import * as cheerio from 'cheerio'
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
  const caseList = caselistItem.build()
  accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(caseList)
  accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(caseList)
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
