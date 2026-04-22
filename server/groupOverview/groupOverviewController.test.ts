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

  describe(`GET /group/:groupId/allocations`, () => {
    it('loads the initial page to view the allocated list', async () => {
      const programmeGroupOverview = ProgrammeGroupOverviewFactory.build()
      accreditedProgrammesManageAndDeliverService.getGroupAllocatedMembers.mockResolvedValue(programmeGroupOverview)
      return request(app)
        .get(`/group/1234/allocations`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Allocations and waitlist`)
        })
    })
  })

  describe('GET /group/:groupId/schedule-overview', () => {
    it('renders success message when message query param is provided', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupScheduleOverview.mockResolvedValue({
        code: 'ABC123',
        preGroupOneToOneStartDate: 'Saturday 31 January 2026',
        gettingStartedModuleStartDate: 'Monday 23 February 2026',
        endDate: 'Monday 14 September 2026',
        sessions: [],
      })

      return request(app)
        .get('/group/1234/schedule-overview?message=Group%20created%20successfully')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Group created successfully')
        })
    })

    it('does not render success message when message query param is absent', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupScheduleOverview.mockResolvedValue({
        code: 'ABC123',
        preGroupOneToOneStartDate: 'Saturday 31 January 2026',
        gettingStartedModuleStartDate: 'Monday 23 February 2026',
        endDate: 'Monday 14 September 2026',
        sessions: [],
      })

      return request(app)
        .get('/group/1234/schedule-overview')
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('Group created successfully')
        })
    })
  })
})
