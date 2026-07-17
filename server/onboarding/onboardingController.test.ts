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

describe('Onboarding controller', () => {
  it('returns result payload for onboarding referral refresh when user has reporting role', async () => {
    const responsePayload = {
      successIds: ['981421e1-0242-4cde-92a2-44c737077f86'],
      notFoundIds: ['af2e88f7-8a89-4a01-b52a-5d7e6805f605'],
      failureIds: ['5a58c31b-8c6f-4e25-bf55-9ad3dcd85f40'],
    }

    accreditedProgrammesManageAndDeliverService.fetchPersonalDetailsForReferrals.mockResolvedValue(responsePayload)

    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(['ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING']),
      }),
    })

    await request(app)
      .get(
        '/onboarding/referrals?referralId=981421e1-0242-4cde-92a2-44c737077f86&referralId=af2e88f7-8a89-4a01-b52a-5d7e6805f605',
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(responsePayload)

    expect(accreditedProgrammesManageAndDeliverService.fetchPersonalDetailsForReferrals).toHaveBeenCalledWith('user1', [
      '981421e1-0242-4cde-92a2-44c737077f86',
      'af2e88f7-8a89-4a01-b52a-5d7e6805f605',
    ])
    expect(sendAuditEvent).toHaveBeenCalledWith(
      'EDIT_ONBOARDING_REFRESH_REFERRALS',
      'user1',
      undefined,
      'NOT_APPLICABLE',
      { details: { referralIds: ['981421e1-0242-4cde-92a2-44c737077f86', 'af2e88f7-8a89-4a01-b52a-5d7e6805f605'] } },
    )
  })

  /**
   * Skipping beacuse the role has not been created in HMPPS Auth, and there is no
   * way to assign it to an account at present.
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
      .get('/onboarding/referrals?referralId=981421e1-0242-4cde-92a2-44c737077f86')
      .expect(302)
      .expect('Location', '/authError')

    expect(accreditedProgrammesManageAndDeliverService.fetchPersonalDetailsForReferrals).not.toHaveBeenCalled()
  })

  it('returns 400 when referralId is missing', async () => {
    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(['ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING']),
      }),
    })

    await request(app)
      .get('/onboarding/referrals')
      .expect(400)
      .expect(res => {
        expect(res.text).toBe('referralId must include at least one UUID')
      })

    expect(accreditedProgrammesManageAndDeliverService.fetchPersonalDetailsForReferrals).not.toHaveBeenCalled()
  })

  it('returns 400 when a referralId is not a UUID', async () => {
    app = appWithAllRoutes({
      services: {
        accreditedProgrammesManageAndDeliverService,
      },
      userSupplier: () => ({
        ...defaultUser,
        token: createUserToken(['ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING']),
      }),
    })

    await request(app)
      .get('/onboarding/referrals?referralId=not-a-uuid')
      .expect(400)
      .expect(res => {
        expect(res.text).toBe('referralId must be a UUID. Repeat the query parameter for multiple IDs.')
      })

    expect(accreditedProgrammesManageAndDeliverService.fetchPersonalDetailsForReferrals).not.toHaveBeenCalled()
  })
})
