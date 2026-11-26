import { Express } from 'express'
import request from 'supertest'

import createUserToken from '../testutils/createUserToken'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { appWithAllRoutes, user as defaultUser } from '../routes/testutils/appSetup'
import sendAuditEvent from '../services/auditService'

const hmppsAuthClientBuilder = jest.fn()

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')

const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

const reportingRole = ['ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING']

const reports = [
  { reportName: 'group-size', method: 'getGroupSizeReport', auditAction: 'VIEW_GROUP_SIZE_REPORT' },
  { reportName: 'dosage', method: 'getDosageReport', auditAction: 'VIEW_DOSAGE_REPORT' },
  { reportName: 'session-rate', method: 'getSessionRateReport', auditAction: 'VIEW_SESSION_RATE_REPORT' },
  {
    reportName: 'facilitator-continuity',
    method: 'getFacilitatorContinuityReport',
    auditAction: 'VIEW_FACILITATOR_CONTINUITY_REPORT',
  },
] as const

let app: Express

const createApp = (roles: string[]) =>
  appWithAllRoutes({
    services: { accreditedProgrammesManageAndDeliverService },
    userSupplier: () => ({ ...defaultUser, token: createUserToken(roles) }),
  })

beforeEach(() => {
  app = createApp(reportingRole)
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('Reporting controller', () => {
  describe.each(reports)('$reportName', ({ reportName, method, auditAction }) => {
    it('returns the CSV for the dates and region', async () => {
      const csv = 'groupCode,size\nGRP-001,12\n'
      accreditedProgrammesManageAndDeliverService[method].mockResolvedValue({
        csv,
        headers: { 'Content-Disposition': `attachment; filename="${reportName}-2026-07-01-09-00.csv"` },
      })

      await request(app)
        .get(`/reporting/${reportName}.csv?startDate=2026-04-01&endDate=2026-06-30&region=North+East+Region`)
        .expect(200)
        .expect('Content-Type', /text\/csv/)
        .expect('Content-Disposition', `attachment; filename="${reportName}-2026-07-01-09-00.csv"`)
        .expect(res => {
          expect(res.text).toBe(csv)
        })

      const query = { startDate: '2026-04-01', endDate: '2026-06-30', region: 'North East Region' }
      expect(accreditedProgrammesManageAndDeliverService[method]).toHaveBeenCalledWith('user1', query)
      expect(sendAuditEvent).toHaveBeenCalledWith(auditAction, 'user1', undefined, 'NOT_APPLICABLE', {
        reportName,
        query,
      })
    })

    it.each([
      ['not provided', ''],
      ['blank', '&region='],
    ])('requests national data when the region is %s', async (_description, regionParam) => {
      accreditedProgrammesManageAndDeliverService[method].mockResolvedValue({ csv: '', headers: {} })

      await request(app)
        .get(`/reporting/${reportName}.csv?startDate=2026-04-01&endDate=2026-06-30${regionParam}`)
        .expect(200)

      expect(accreditedProgrammesManageAndDeliverService[method]).toHaveBeenCalledWith('user1', {
        startDate: '2026-04-01',
        endDate: '2026-06-30',
      })
    })

    it('allows the start and end dates to be the same', async () => {
      accreditedProgrammesManageAndDeliverService[method].mockResolvedValue({ csv: '', headers: {} })

      await request(app).get(`/reporting/${reportName}.csv?startDate=2026-04-01&endDate=2026-04-01`).expect(200)
    })

    it.each([
      ['both dates are missing', '', /startDate and endDate must both be valid dates/],
      ['the start date is missing', '?endDate=2026-06-30', /startDate and endDate must both be valid dates/],
      ['the end date is missing', '?startDate=2026-04-01', /startDate and endDate must both be valid dates/],
      [
        'a date does not exist',
        '?startDate=2026-02-30&endDate=2026-06-30',
        /startDate and endDate must both be valid dates/,
      ],
      [
        'a date has a time',
        '?startDate=2026-04-01T09:00:00&endDate=2026-06-30',
        /startDate and endDate must both be valid dates/,
      ],
      [
        'the link is from an older generator',
        '?groupStartedSince=2026-05-18T13:30:00.000Z',
        /get a new link from the latest version/,
      ],
      [
        'the end date is before the start date',
        '?startDate=2026-06-30&endDate=2026-04-01',
        /endDate must be the same as or after startDate/,
      ],
      [
        'there is more than one region',
        '?startDate=2026-04-01&endDate=2026-06-30&region=Wales&region=London',
        /Only one region can be provided/,
      ],
    ])('returns 400 when %s', async (_description, queryString, message) => {
      await request(app)
        .get(`/reporting/${reportName}.csv${queryString}`)
        .expect(400)
        .expect(res => {
          expect(res.text).toMatch(message)
        })

      expect(accreditedProgrammesManageAndDeliverService[method]).not.toHaveBeenCalled()
      expect(sendAuditEvent).not.toHaveBeenCalled()
    })
  })

  /**
   * Skipping because the role does not currently exist in HMPPS Auth, and therefore we have no way
   * to protect/prevent access
   */
  it.skip('redirects to auth error when user does not have reporting role', async () => {
    app = createApp(['ROLE_PROBATION'])

    await request(app)
      .get('/reporting/group-size.csv?startDate=2026-04-01&endDate=2026-06-30')
      .expect(302)
      .expect('Location', '/authError')

    expect(accreditedProgrammesManageAndDeliverService.getGroupSizeReport).not.toHaveBeenCalled()
  })
})
