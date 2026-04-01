import { GroupDetailsResponse } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../../testutils/testUtils'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    createGroupFormData: {},
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
})

describe('Edit Group Code Controller', () => {
  describe('GET /group/:groupId/create-a-group/create-group-code', () => {
    it('loads the edit group code page with the current code', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
      } as GroupDetailsResponse)

      return request(app)
        .get(`/group/${groupId}/create-a-group/create-group-code`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group code')
          expect(res.text).toContain('EXISTING123')
        })
    })

    it('loads the edit group code page when session createGroupFormData is missing', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
      } as GroupDetailsResponse)

      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get(`/group/${groupId}/create-a-group/create-group-code`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group code')
          expect(res.text).toContain('EXISTING123')
        })
    })
  })

  describe('POST /group/:groupId/create-a-group/create-group-code', () => {
    it('updates the group code and redirects to group details', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        regionName: 'Test Region',
      })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({} as never)

      return request(app)
        .post(`/group/${groupId}/create-a-group/create-group-code`)
        .type('form')
        .send({ 'create-group-code': 'UPDATED123' })
        .expect(302)
        .expect(res => {
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            groupCode: 'UPDATED123',
          })
          expect(res.text).toContain(`Redirecting to /group/${groupId}/group-details`)
        })
    })

    it('returns with errors if updated group code already exists for another group', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: randomUUID(),
        code: 'DUPLICATE123',
        regionName: 'Test Region',
      })

      return request(app)
        .post(`/group/${groupId}/create-a-group/create-group-code`)
        .type('form')
        .send({ 'create-group-code': 'DUPLICATE123' })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain(
            'Group code DUPLICATE123 already exists for a group in this region. Enter a different code.',
          )
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).not.toHaveBeenCalled()
        })
    })
  })
})
