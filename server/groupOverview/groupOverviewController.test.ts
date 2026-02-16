import { Express } from 'express'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import ProgrammeGroupDetailsFactory from '../testutils/factories/programmeGroupDetailsFactory'

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

describe('groupDetails', () => {
  describe(`GET /groupOverview/:groupId/waitlist`, () => {
    it('loads the initial page to view the waitlist', async () => {
      const programmeGroupDetails = ProgrammeGroupDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getGroupWaitlistMembers.mockResolvedValue(programmeGroupDetails)
      return request(app)
        .get(`/groupOverview/:groupId/waitlist`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Allocations and waitlist`)
        })
    })
  })

  describe(`GET /groupOverview/:groupId/allocated`, () => {
    it('loads the initial page to view the allocated list', async () => {
      const programmeGroupDetails = ProgrammeGroupDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers.mockResolvedValue(programmeGroupDetails)
      return request(app)
        .get(`/groupOverview/:groupId/allocated`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Allocations and waitlist`)
        })
    })
  })
})
