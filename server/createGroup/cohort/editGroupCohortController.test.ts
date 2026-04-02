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

describe('Edit Group Cohort Controller', () => {
  describe('GET /group/:groupId/edit-a-group/edit-group-cohort', () => {
    it('loads the edit group cohort page with the current cohort', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the group cohort')
          expect(res.text).toContain('General offence')
        })
    })

    it('preselects general offence radio when legacy GENERAL_OFFENCE cohort is returned', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL_OFFENCE',
      } as unknown as GroupDetailsResponse)

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('value="GENERAL" checked')
        })
    })

    it('preselects general offence radio when cohort text is returned', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'General offence',
      } as unknown as GroupDetailsResponse)

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('value="GENERAL" checked')
        })
    })

    it('loads the edit group cohort page when session createGroupFormData is missing', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)

      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the group cohort')
          expect(res.text).toContain('General offence')
        })
    })
  })

  describe('POST /group/:groupId/edit-a-group/edit-group-cohort', () => {
    it('updates the group cohort and redirects to group details', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupByCohortInRegion.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
        regionName: 'Test Region',
      })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({} as never)

      return request(app)
        .post(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .type('form')
        .send({ 'create-group-cohort': 'GENERAL_LDC' })
        .expect(302)
        .expect(res => {
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            cohort: 'GENERAL_LDC',
          })
          expect(res.text).toContain(`Redirecting to /group/${groupId}/group-details`)
        })
    })

    it('returns with errors if cohort is not selected', async () => {
      const groupId = randomUUID()

      return request(app)
        .post(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a cohort')
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).not.toHaveBeenCalled()
        })
    })
  })
})
