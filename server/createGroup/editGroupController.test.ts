import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import { EditGroupDaysAndTimes } from '@manage-and-deliver-api'
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
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({
        successMessage: 'The days and times and schedule have been updated.',
      })

      return request(app)
        .post(`/group/${groupId}/edit-start-date-rescheduled`)
        .type('form')
        .send({ 'reschedule-other-sessions': 'true' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/')
          expect(res.text).toContain('/group-details')
          expect(res.text).toContain(encodeURIComponent('The days and times and schedule have been updated.'))
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            earliestStartDate: '15/06/2026',
            automaticallyRescheduleOtherSessions: true,
          })
        })
    })

    it('updates the group and redirects on successful submission with manual rescheduling', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({
        successMessage: 'The days and times have been updated.',
      })

      return request(app)
        .post(`/group/${groupId}/edit-start-date-rescheduled`)
        .type('form')
        .send({ 'reschedule-other-sessions': 'false' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/')
          expect(res.text).toContain('/group-details')
          expect(res.text).toContain(encodeURIComponent('The days and times have been updated.'))
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            earliestStartDate: '15/06/2026',
            automaticallyRescheduleOtherSessions: false,
          })
        })
    })
  })

  describe('GET /group/:groupId/edit-group-days-and-times', () => {
    it('loads the edit group days and times page with current schedule from group details', async () => {
      const groupDetailsWithDaysAndTimes: EditGroupDaysAndTimes = {
        id: groupId,
        code: 'TEST123',
        programmeGroupSessionSlots: [
          {
            dayOfWeek: 'MONDAY',
            hour: 10,
            minutes: 0,
            amOrPm: 'AM',
          },
          {
            dayOfWeek: 'WEDNESDAY',
            hour: 2,
            minutes: 0,
            amOrPm: 'PM',
          },
        ],
      }

      accreditedProgrammesManageAndDeliverService.getBffEditGroupDaysAndTimes.mockResolvedValue(
        groupDetailsWithDaysAndTimes,
      )

      return request(app)
        .get(`/group/${groupId}/edit-group-days-and-times`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit when will the group run')
          expect(accreditedProgrammesManageAndDeliverService.getBffEditGroupDaysAndTimes).toHaveBeenCalledWith(
            'user1',
            groupId,
          )
        })
    })
  })

  describe('POST /group/:groupId/edit-group-days-and-times', () => {
    it('redirects to reschedule page on successful submission', async () => {
      const groupDetailsWithDaysAndTimes: EditGroupDaysAndTimes = {
        id: groupId,
        code: 'TEST123',
        programmeGroupSessionSlots: [
          {
            dayOfWeek: 'MONDAY',
            hour: 10,
            minutes: 0,
            amOrPm: 'AM',
          },
        ],
      }

      accreditedProgrammesManageAndDeliverService.getBffEditGroupDaysAndTimes.mockResolvedValue(
        groupDetailsWithDaysAndTimes,
      )

      return request(app)
        .post(`/group/${groupId}/edit-group-days-and-times`)
        .type('form')
        .send({
          'days-of-week': 'TUESDAY',
          'tuesday-hour': '9',
          'tuesday-minute': '30',
          'tuesday-ampm': 'am',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/edit-group-days-and-times-rescheduled`)
        })
    })

    it('returns with errors if schedule data is invalid', async () => {
      const groupDetailsWithDaysAndTimes: EditGroupDaysAndTimes = {
        id: groupId,
        code: 'TEST123',
        programmeGroupSessionSlots: [
          {
            dayOfWeek: 'MONDAY',
            hour: 10,
            minutes: 0,
            amOrPm: 'AM',
          },
        ],
      }

      accreditedProgrammesManageAndDeliverService.getBffEditGroupDaysAndTimes.mockResolvedValue(
        groupDetailsWithDaysAndTimes,
      )

      return request(app).post(`/group/${groupId}/edit-group-days-and-times`).type('form').send({}).expect(400)
    })
  })

  describe('GET /group/:groupId/edit-group-days-and-times-rescheduled', () => {
    it('loads the reschedule confirmation page for days and times', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          createGroupSessionSlot: [
            {
              dayOfWeek: 'TUESDAY',
              hour: 9,
              minutes: 30,
              amOrPm: 'AM',
            },
          ],
          previousSessions: [
            {
              dayOfWeek: 'MONDAY',
              hour: 10,
              minutes: 0,
              amOrPm: 'AM',
            },
          ],
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .get(`/group/${groupId}/edit-group-days-and-times-rescheduled`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Rescheduling sessions')
          expect(res.text).toContain('Previous days and times')
          expect(res.text).toContain('New days and times')
        })
    })
  })

  describe('POST /group/:groupId/edit-group-days-and-times-rescheduled', () => {
    const sessionData: Partial<SessionData> = {
      createGroupFormData: {
        groupCode: 'TEST123',
        createGroupSessionSlot: [
          {
            dayOfWeek: 'TUESDAY',
            hour: 9,
            minutes: 30,
            amOrPm: 'AM',
          },
        ],
        previousSessions: [
          {
            dayOfWeek: 'MONDAY',
            hour: 10,
            minutes: 0,
            amOrPm: 'AM',
          },
        ],
      },
    }

    it('updates the group days and times with automatic rescheduling and URL encodes success message', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({
        successMessage: 'Group days and times updated',
      })

      return request(app)
        .post(`/group/${groupId}/edit-group-days-and-times-rescheduled`)
        .type('form')
        .send({ 'reschedule-other-sessions': 'true' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/')
          expect(res.text).toContain('/group-details')
          expect(res.text).toContain(encodeURIComponent('Group days and times updated'))
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            createGroupSessionSlot: sessionData.createGroupFormData.createGroupSessionSlot,
            automaticallyRescheduleOtherSessions: true,
          })
        })
    })

    it('updates the group days and times with manual rescheduling', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({
        successMessage: 'Group days and times updated',
      })

      return request(app)
        .post(`/group/${groupId}/edit-group-days-and-times-rescheduled`)
        .type('form')
        .send({ 'reschedule-other-sessions': 'false' })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('Redirecting to /group/')
          expect(res.text).toContain('/group-details')
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith('user1', groupId, {
            createGroupSessionSlot: sessionData.createGroupFormData.createGroupSessionSlot,
            automaticallyRescheduleOtherSessions: false,
          })
        })
    })

    it('returns with errors if reschedule option is not selected', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      return request(app)
        .post(`/group/${groupId}/edit-group-days-and-times-rescheduled`)
        .type('form')
        .send({})
        .expect(400)
    })
  })
})
