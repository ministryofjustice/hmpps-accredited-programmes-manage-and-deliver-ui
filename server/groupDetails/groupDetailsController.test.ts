import { Group } from '@manage-and-deliver-api'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupFactory from '../testutils/factories/groupFactory'

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

describe('GroupDetailsController', () => {
  describe('GET /group/:groupId/group-details', () => {
    it('should render the group details page', async () => {
      const groupDetail: Group = GroupFactory.build({ code: 'TEST-GROUP-123' })
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue(groupDetail)

      return request(app)
        .get('/group/GROUP-123/group-details')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Group details')
          expect(accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion).toHaveBeenCalledWith(
            'user1',
            'GROUP-123',
          )
        })
    })

    it('should handle errors when fetching group details fails', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockRejectedValue(
        new Error('Failed to fetch group details'),
      )

      return request(app).get('/group/GROUP-123/group-details').expect(500)
    })
  })
})
