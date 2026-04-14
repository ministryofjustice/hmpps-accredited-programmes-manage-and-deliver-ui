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

describe('Edit Group Sex Controller', () => {
  describe('GET /group/:groupId/edit-a-group/edit-group-sex', () => {
    it('loads the edit group sex page with the current sex', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupSex.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      })

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-sex`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the gender of the group')
          expect(res.text).toContain('Male')
        })
    })

    it('preselects male radio when MALE sex is returned', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as unknown as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupSex.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      })

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-sex`)
        .expect(200)
        .expect(res => {
          expect(res.text).toMatch(/<input[^>]*value="MALE"[^>]*checked|<input[^>]*checked[^>]*value="MALE"/)
        })
    })

    it('loads the edit group sex page when session createGroupFormData is missing', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupSex.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      })

      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-sex`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the gender of the group')
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/:groupId/edit-a-group/edit-group-sex', () => {
    it('updates the group sex and redirects to group details', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as unknown as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupSex.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({} as never)

      return request(app)
        .post(`/group/${groupId}/edit-a-group/edit-group-sex`)
        .type('form')
        .send({ 'create-group-sex': 'FEMALE' })
        .expect(302)
        .expect(res => {
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            sex: 'FEMALE',
          })
          expect(res.text).toContain(`Redirecting to /group/${groupId}/group-details`)
        })
    })

    it('returns with errors if sex is not selected', async () => {
      const groupId = randomUUID()
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as unknown as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupSex.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      })

      return request(app)
        .post(`/group/${groupId}/edit-a-group/edit-group-sex`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a sex')
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).not.toHaveBeenCalled()
        })
    })
  })
})
