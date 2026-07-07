import { GroupsByRegion } from '@manage-and-deliver-api'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupsByRegionFactory from '../testutils/factories/groupsByRegionFactory'
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
  const groupList: GroupsByRegion = GroupsByRegionFactory.build()
  accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)
})

describe('GroupController', () => {
  describe('GET /groups/not-started-and-in-progress', () => {
    it('should render the not started group list page', async () => {
      return request(app)
        .get('/groups/not-started-and-in-progress')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Building Choices: moderate intensity')
          expect(res.text).toContain('Groups')
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'SEARCH_NOT_STARTED_OR_IN_PROGRESS_GROUP_LIST',
            'user1',
            JSON.stringify({}),
            'SEARCH_TERM',
          )
        })
    })

    it('refetches with reset delivery location filters when requested locations are invalid', async () => {
      const groupList: GroupsByRegion = GroupsByRegionFactory.build({ deliveryLocationNames: ['delivery-location-2'] })
      accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)

      await request(app)
        .get('/groups/not-started-and-in-progress?pdu=PDU3&deliveryLocations=delivery-location-1')
        .expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledTimes(2)
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: 'PDU3', deliveryLocations: ['delivery-location-1'] }),
        'NOT_STARTED_OR_IN_PROGRESS',
      )
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: 'PDU3' }),
        'NOT_STARTED_OR_IN_PROGRESS',
      )
    })
  })

  describe('GET /groups/completed', () => {
    it('should render the completed group list page', async () => {
      return request(app)
        .get('/groups/completed')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Building Choices: moderate intensity')
          expect(res.text).toContain('Groups')
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'SEARCH_COMPLETED_GROUP_LIST',
            'user1',
            JSON.stringify({}),
            'SEARCH_TERM',
          )
        })
    })

    it('refetches with reset delivery location filters when requested locations are invalid', async () => {
      const groupList: GroupsByRegion = GroupsByRegionFactory.build({ deliveryLocationNames: ['delivery-location-2'] })
      accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)

      await request(app).get('/groups/completed?pdu=PDU3&deliveryLocations=delivery-location-1').expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenCalledTimes(2)
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: 'PDU3', deliveryLocations: ['delivery-location-1'] }),
        'COMPLETE',
      )
      expect(accreditedProgrammesManageAndDeliverService.getGroupList).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({ page: 0, size: 50 }),
        expect.objectContaining({ pdu: 'PDU3' }),
        'COMPLETE',
      )
    })
  })
})
