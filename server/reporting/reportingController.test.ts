import { Express } from 'express'
import request from 'supertest'

import createUserToken from '../testutils/createUserToken'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { appWithAllRoutes, user as defaultUser } from '../routes/testutils/appSetup'

const hmppsAuthClientBuilder = jest.fn()

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

describe('Reporting controller', () => {
  it('returns CSV for group size report when user has reporting role', async () => {
    const csv = 'groupCode,size\\nGRP-001,12\\n'
    accreditedProgrammesManageAndDeliverService.getGroupSizeReport.mockResolvedValue(csv)

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
      .get('/reporting/group-size.csv?groupStartedSince=2026-05-18T13:30:00')
      .expect(200)
      .expect('Content-Type', /text\/csv/)
      .expect(res => {
        expect(res.text).toBe(csv)
      })

    expect(accreditedProgrammesManageAndDeliverService.getGroupSizeReport).toHaveBeenCalledWith(
      'user1',
      '2026-05-18T13:30:00',
    )
  })

  it('redirects to auth error when user does not have reporting role', async () => {
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
        token: createUserToken(['ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ACPMAD_UI_REPORTING']),
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
