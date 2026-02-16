import { GroupsByRegion } from '@manage-and-deliver-api'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupsByRegionFactory from '../testutils/factories/groupsByRegionFactory'

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
  const groupList: GroupsByRegion = GroupsByRegionFactory.build()
  accreditedProgrammesManageAndDeliverService.getGroupList.mockResolvedValue(groupList)
})

describe('GroupController', () => {
  describe('GET /groups/not-started', () => {
    it('should render the not started group list page', async () => {
      return request(app)
        .get('/groups/not-started')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Building Choices groups')
        })
    })
  })

  describe('GET /groups/started', () => {
    it('should render the started group list page', async () => {
      return request(app)
        .get('/groups/started')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Building Choices groups')
        })
    })
  })
})
