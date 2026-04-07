import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupDetailsFactory from '../testutils/factories/groupDetailsFactory'
import TestUtils from '../testutils/testUtils'

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
  const sessionData: Partial<SessionData> = {
    createGroupFormData: {},
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
})

describe('Edit Group Controller', () => {
  const groupId = randomUUID()
  const groupDetails = GroupDetailsFactory.build({
    id: groupId,
    code: 'TEST123',
    startDate: '2026-05-28',
  })

  describe('GET /group/:groupId/edit-group-start-date', () => {
    it('loads the edit group date page and displays the current start date from group details', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetails)

      return request(app)
        .get(`/group/${groupId}/edit-group-start-date`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit start date for the group')
          expect(res.text).toContain('28/05/2026')
          expect(accreditedProgrammesManageAndDeliverService.getGroupDetailsById).toHaveBeenCalledWith('user1', groupId)
        })
    })

    it('displays previously entered date from session if available', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          earliestStartDate: '15/06/2026',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetails)

      return request(app)
        .get(`/group/${groupId}/edit-group-start-date`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('15/06/2026')
        })
    })
  })

  describe('POST /group/:groupId/edit-group-start-date', () => {
    it('redirects to reschedule page on successful submission', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetails)

      return request(app)
        .post(`/group/${groupId}/edit-group-start-date`)
        .type('form')
        .send({ 'create-group-date': '15/06/2026' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/edit-start-date-rescheduled`)
        })
    })

    it('returns with errors if date is missing', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetails)

      return request(app)
        .post(`/group/${groupId}/edit-group-start-date`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Enter or select a date')
        })
    })
  })

  describe('GET /group/:groupId/edit-start-date-rescheduled', () => {
    it('loads the reschedule confirmation page', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          earliestStartDate: '15/06/2026',
          previousDate: '28/05/2026',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get(`/group/${groupId}/edit-start-date-rescheduled`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Rescheduling sessions')
          expect(res.text).toContain('Previous start date')
          expect(res.text).toContain('New start date')
        })
    })
  })

  describe('POST /group/:groupId/edit-start-date-rescheduled', () => {
    const sessionData: Partial<SessionData> = {
      createGroupFormData: {
        groupCode: 'TEST123',
        earliestStartDate: '15/06/2026',
        previousDate: '28/05/2026',
      },
    }

    it('updates the group and redirects on successful submission with automatic rescheduling', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue(null)

      return request(app)
        .post(`/group/${groupId}/edit-start-date-rescheduled`)
        .type('form')
        .send({ 'reschedule-other-sessions': 'true' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/')
          expect(res.text).toContain('/group-details')
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            earliestStartDate: '15/06/2026',
            automaticallyRescheduleOtherSessions: true,
          })
        })
    })

    it('updates the group and redirects on successful submission with manual rescheduling', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue(null)

      return request(app)
        .post(`/group/${groupId}/edit-start-date-rescheduled`)
        .type('form')
        .send({ 'reschedule-other-sessions': 'false' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/')
          expect(res.text).toContain('/group-details')
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            earliestStartDate: '15/06/2026',
            automaticallyRescheduleOtherSessions: false,
          })
        })
    })
  })
})
