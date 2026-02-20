import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ProgrammeGroupOverviewFactory from '../testutils/factories/programmeGroupAllocationsFactory'

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
})

describe('groupOverview', () => {
  describe(`GET /group/:groupId/waitlist`, () => {
    it('loads the initial page to view the waitlist', async () => {
      const programmeGroupOverview = ProgrammeGroupOverviewFactory.build()
      accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers.mockResolvedValue(programmeGroupOverview)
      return request(app)
        .get(`/group/1234/waitlist`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Allocations and waitlist`)
        })
    })
  })

  describe(`GET /group/:groupId/allocated`, () => {
    it('loads the initial page to view the allocated list', async () => {
      const programmeGroupOverview = ProgrammeGroupOverviewFactory.build()
      accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers.mockResolvedValue(programmeGroupOverview)
      return request(app)
        .get(`/group/1234/allocated`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Allocations and waitlist`)
        })
    })
  })
})
