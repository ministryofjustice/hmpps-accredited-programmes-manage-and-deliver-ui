import { CaseListReferrals } from '@manage-and-deliver-api'
import * as cheerio from 'cheerio'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import caseListReferralsFactory from '../testutils/factories/caseListReferralsFactory'

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
  const caseListReferrals: CaseListReferrals = caseListReferralsFactory.build()
  accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(caseListReferrals)
  accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(caseListReferrals)
})

describe(`Caselist controller`, () => {
  test.each([
    [
      '/pdu/open-referrals?cohort=Sexual offence&status=Awaiting+assessment',
      'Sexual offence',
      'Awaiting assessment',
      undefined,
      undefined,
    ],
    [`/pdu/open-referrals`, undefined, undefined, undefined, undefined],
    ['/pdu/closed-referrals', undefined, undefined, undefined, undefined],
    [
      '/pdu/open-referrals?cohort=General offence - LDC&status=Programme+complete',
      'General offence - LDC',
      'Programme complete',
      undefined,
      undefined,
    ],
    ['/pdu/open-referrals?pdu=PDU1&reportingTeam=Team1', undefined, undefined, 'PDU1', 'Team1'],
  ])(
    `should set the correct filters based on the url provided %s`,
    async (url: string, cohortValue, referralStatusValue, pduValue, reportingTeamValue) => {
      await request(app)
        .get(url)
        .expect(200)
        .expect(res => {
          expect(res.ok)
          const $ = cheerio.load(res.text)
          const cohortInput = $('#cohort option[selected]').val()
          expect(cohortInput).toBe(cohortValue)
          const referralStatusInput = $('#status optgroup option[selected]').val()
          expect(referralStatusInput).toBe(referralStatusValue)
          const pduInput = $('#pdu option[selected]').val()
          expect(pduInput).toBe(pduValue)
          const reportingTeamInput = $('input[type="checkbox"][name="reportingTeam"]:checked').val()
          expect(reportingTeamInput).toBe(reportingTeamValue)
        })
    },
  )
})
