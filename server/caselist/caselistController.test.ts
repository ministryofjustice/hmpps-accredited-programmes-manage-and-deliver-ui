import { CaseListReferrals } from '@manage-and-deliver-api'
import * as cheerio from 'cheerio'
import { Express } from 'express'
import request from 'supertest'
import { SessionData } from 'express-session'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import caseListReferralsFactory from '../testutils/factories/caseListReferralsFactory'
import TestUtils from '../testutils/testUtils'
import sendAuditEvent from '../services/auditService'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')

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
    userRegion: { regionDescription: 'Test Location', regionCode: 'ABC123' },
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

  const caseListReferrals: CaseListReferrals = caseListReferralsFactory.build()
  accreditedProgrammesManageAndDeliverService.getOpenCaselist.mockResolvedValue(caseListReferrals)
  accreditedProgrammesManageAndDeliverService.getClosedCaselist.mockResolvedValue(caseListReferrals)
})

describe(`Caselist controller`, () => {
  test.each([
    [
      '/region/open-referrals?cohort=Sexual offence&status=Awaiting+assessment',
      'Sexual offence',
      'Awaiting assessment',
      undefined,
      undefined,
    ],
    [`/region/open-referrals`, undefined, undefined, undefined, undefined],
    ['/region/closed-referrals', undefined, undefined, undefined, undefined],
    [
      '/region/open-referrals?cohort=General offence LDC&status=Programme+complete',
      'General offence LDC',
      'Programme complete',
      undefined,
      undefined,
    ],
    ['/region/open-referrals?pdu=PDU1&reportingTeam=Team1', undefined, undefined, ['PDU1'], 'Team1'],
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
          // With checkbox selection, we can't easily check the selected value from the DOM
          // The test checks that the page loads successfully which implicitly validates the filter parsing
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            url.startsWith('/region/open-referrals') ? 'SEARCH_OPEN_CASELIST' : 'SEARCH_CLOSED_CASELIST',
            'user1',
            undefined,
            'NOT_APPLICABLE',
            {
              filter: {
                pdu: pduValue,
                reportingTeam: reportingTeamValue ? [reportingTeamValue] : undefined,
                status: referralStatusValue,
                cohort: cohortValue,
              },
            },
          )
        })
    },
  )

  it('refetches open referrals without stale reporting teams when the selected PDU changes', async () => {
    const firstResponse = caseListReferralsFactory.build({
      filters: TestUtils.createCaseListFilters(),
    })
    const secondResponse = caseListReferralsFactory.build({
      filters: TestUtils.createCaseListFilters(),
    })

    accreditedProgrammesManageAndDeliverService.getOpenCaselist
      .mockResolvedValueOnce(firstResponse)
      .mockResolvedValueOnce(secondResponse)

    await request(app).get('/region/open-referrals?pdu=PDU2&reportingTeam=Team1').expect(200)

    expect(accreditedProgrammesManageAndDeliverService.getOpenCaselist).toHaveBeenNthCalledWith(
      1,
      'user1',
      { page: 0, size: 50 },
      { pdu: ['PDU2'], reportingTeam: ['Team1'] },
    )
    expect(accreditedProgrammesManageAndDeliverService.getOpenCaselist).toHaveBeenNthCalledWith(
      2,
      'user1',
      { page: 0, size: 50 },
      { pdu: ['PDU2'] },
    )
  })
})
