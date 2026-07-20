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

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

describe('Reporting controller', () => {
  const reportingRole = ['ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING']

  it('returns CSV for group size report when user has reporting role', async () => {
    const csv = 'groupCode,size\\nGRP-001,12\\n'
    accreditedProgrammesManageAndDeliverService.getGroupSizeReport.mockResolvedValue({
      csv,
      headers: {
        'Content-Disposition': 'attachment; filename="group-size-report.csv"',
      },
    })

    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(reportingRole),
      }),
    })

    await request(app)
      .get('/reporting/group-size.csv?groupStartedSince=2026-05-18T13:30:00')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', 'attachment; filename="group-size-report.csv"')
      .expect(res => {
        expect(res.text).toBe(csv)
      })

    expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_GROUP_SIZE_REPORT', 'user1', '2026-05-18T13:30:00', 'SEARCH_TERM')
    expect(accreditedProgrammesManageAndDeliverService.getGroupSizeReport).toHaveBeenCalledWith(
      'user1',
      '2026-05-18T13:30:00',
    )
  })

  it('returns CSV for dosage report when user has reporting role', async () => {
    const csv = 'referralId,dosage\\nREF-001,87\\n'
    accreditedProgrammesManageAndDeliverService.getDosageReport.mockResolvedValue({
      csv,
      headers: {
        'Content-Disposition': 'attachment; filename="dosage-report.csv"',
      },
    })

    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(reportingRole),
      }),
    })

    await request(app)
      .get('/reporting/dosage.csv?referralsCreatedSince=2026-05-21')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', 'attachment; filename="dosage-report.csv"')
      .expect(res => {
        expect(res.text).toBe(csv)
      })

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_DOSAGE_REPORT',
      'user1',
      undefined,
      'NOT_APPLICABLE',
      expect.objectContaining({ reportName: 'dosage', query: { referralsCreatedSince: '2026-05-21' } }),
    )

    expect(accreditedProgrammesManageAndDeliverService.getDosageReport).toHaveBeenCalledWith('user1', {
      referralsCreatedSince: '2026-05-21',
    })
  })

  it('returns CSV for session rate report when user has reporting role', async () => {
    const csv = 'weekEnding,sessionRate\\n2026-05-24,0.92\\n'
    accreditedProgrammesManageAndDeliverService.getSessionRateReport.mockResolvedValue({
      csv,
      headers: {
        'Content-Disposition': 'attachment; filename="session-rate-report.csv"',
      },
    })

    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(reportingRole),
      }),
    })

    await request(app)
      .get('/reporting/session-rate.csv?groupsStartedAfter=2026-05-21')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', 'attachment; filename="session-rate-report.csv"')
      .expect(res => {
        expect(res.text).toBe(csv)
      })

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_SESSION_RATE_REPORT',
      'user1',
      undefined,
      'NOT_APPLICABLE',
      expect.objectContaining({ reportName: 'session-rate', query: { groupsStartedAfter: '2026-05-21' } }),
    )

    expect(accreditedProgrammesManageAndDeliverService.getSessionRateReport).toHaveBeenCalledWith('user1', {
      groupsStartedAfter: '2026-05-21',
    })
  })

  it('returns CSV for facilitator continuity report when user has reporting role', async () => {
    const csv = 'groupCode,continuity\\nGRP-001,0.8\\n'
    accreditedProgrammesManageAndDeliverService.getFacilitatorContinuityReport.mockResolvedValue({
      csv,
      headers: {
        'Content-Disposition': 'attachment; filename="facilitator-continuity-report.csv"',
      },
    })

    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(reportingRole),
      }),
    })

    await request(app)
      .get('/reporting/facilitator-continuity.csv?groupsCreatedSince=2026-05-21T12:00:00')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect('Content-Disposition', 'attachment; filename="facilitator-continuity-report.csv"')
      .expect(res => {
        expect(res.text).toBe(csv)
      })

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_FACILITATOR_CONTINUITY_REPORT',
      'user1',
      undefined,
      'NOT_APPLICABLE',
      expect.objectContaining({
        reportName: 'facilitator-continuity',
        query: { groupsCreatedSince: '2026-05-21T12:00:00' },
      }),
    )

    expect(accreditedProgrammesManageAndDeliverService.getFacilitatorContinuityReport).toHaveBeenCalledWith('user1', {
      groupsCreatedSince: '2026-05-21T12:00:00',
    })
  })

  /**
   * Skipping because the role does not currently exist in HMPPS Auth, and therefore we have no way
   * to protect/prevent access
   */
  it.skip('redirects to auth error when user does not have reporting role', async () => {
    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(['ROLE_PROBATION']),
      }),
    })

    await request(app)
      .get('/reporting/group-size.csv?groupStartedSince=2026-05-18T13:30:00')
      .expect(302)
      .expect('Location', '/authError')

    expect(accreditedProgrammesManageAndDeliverService.getGroupSizeReport).not.toHaveBeenCalled()
  })

  it('returns 400 when groupStartedSince is not a valid date-time', async () => {
    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(reportingRole),
      }),
    })

    await request(app)
      .get('/reporting/group-size.csv?groupStartedSince=not-a-date')
      .expect(400)
      .expect(res => {
        expect(res.text).toBe('groupStartedSince must be a valid date-time string')
      })

    expect(accreditedProgrammesManageAndDeliverService.getGroupSizeReport).not.toHaveBeenCalled()
  })
})
