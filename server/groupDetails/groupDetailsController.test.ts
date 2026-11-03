import { GroupDetailsResponse } from '@manage-and-deliver-api'
import { Express } from 'express'
import request from 'supertest'
import { load } from 'cheerio'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupDetailsFactory from '../testutils/factories/groupDetailsFactory'
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
  app = appWithAllRoutes({
    services: {
      accreditedProgrammesManageAndDeliverService,
    },
  })
})

describe('GroupDetailsController', () => {
  describe('GET /group/:groupId/group-details', () => {
    it('renders unique IDs across all summary lists', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(
        GroupDetailsFactory.build({ startDate: 'Monday 1 April 3055' }),
      )

      const response = await request(app).get('/group/GROUP-123/group-details').expect(200)
      const $ = load(response.text)
      const ids = $('[id]')
        .map((_, element) => $(element).attr('id'))
        .get()

      expect(new Set(ids).size).toBe(ids.length)
      expect(
        $('.govuk-summary-list__actions a')
          .map((_, element) => $(element).attr('id'))
          .get(),
      ).toEqual([
        'group-code-change-link-0',
        'group-timings-change-link-0',
        'group-timings-change-link-1',
        'group-participants-change-link-0',
        'group-participants-change-link-1',
        'group-location-change-link-0',
        'group-location-change-link-1',
        'group-staff-change-link-0',
        'group-staff-change-link-1',
        'group-staff-change-link-2',
      ])
    })

    it('should render the group details page', async () => {
      const groupDetail: GroupDetailsResponse = GroupDetailsFactory.build({ code: 'TEST-GROUP-123' })
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetail)

      return request(app)
        .get('/group/GROUP-123/group-details')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Group details')
          expect(accreditedProgrammesManageAndDeliverService.getGroupDetailsById).toHaveBeenCalledWith(
            'user1',
            'GROUP-123',
          )
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith('VIEW_GROUP_DETAILS', 'user1', 'GROUP-123', 'SEARCH_TERM')
        })
    })

    it('should handle errors when fetching group details fails', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockRejectedValue(
        new Error('Failed to fetch group details'),
      )

      return request(app).get('/group/GROUP-123/group-details').expect(500)
    })
  })
})
