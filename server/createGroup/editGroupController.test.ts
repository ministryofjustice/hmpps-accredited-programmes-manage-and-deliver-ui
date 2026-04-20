import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import { EditGroupCohort, EditGroupDaysAndTimes, EditGroupSex, GroupDetailsResponse } from '@manage-and-deliver-api'
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

  describe('GET /group/:groupId/edit-group-gender', () => {
    it('loads the edit group gender page with the current gender', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getGroupSexDetails.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      } as EditGroupSex)

      return request(app)
        .get(`/group/${groupId}/edit-group-gender`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the gender of the group')
          expect(res.text).toContain('Male')
        })
    })

    it('preselects male radio when MALE sex is returned', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getGroupSexDetails.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      } as EditGroupSex)

      return request(app)
        .get(`/group/${groupId}/edit-group-gender`)
        .expect(200)
        .expect(res => {
          expect(res.text).toMatch(/<input[^>]*value="MALE"[^>]*checked|<input[^>]*checked[^>]*value="MALE"/)
        })
    })

    it('loads the edit group sex page when session createGroupFormData is missing', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getGroupSexDetails.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      } as EditGroupSex)

      const tempApp = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      return request(tempApp)
        .get(`/group/${groupId}/edit-group-gender`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the gender of the group')
          expect(res.text).toContain('Male')
        })
    })
  })

  describe('POST /group/:groupId/edit-group-gender', () => {
    it('updates the group gender and redirects to group details', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getGroupSexDetails.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      } as EditGroupSex)
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({} as never)

      return request(app)
        .post(`/group/${groupId}/edit-group-gender`)
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

    it('returns with errors if gender is not selected', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        sex: 'MALE',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getGroupSexDetails.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the gender of the group',
        submitButtonText: 'Submit',
        radios: [
          { text: 'Male', value: 'MALE', selected: true },
          { text: 'Female', value: 'FEMALE', selected: false },
          { text: 'Mixed', value: 'MIXED', selected: false },
        ],
      } as EditGroupSex)

      return request(app)
        .post(`/group/${groupId}/edit-group-gender`)
        .type('form')
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a gender')
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).not.toHaveBeenCalled()
        })
    })
  })

  describe('GET /group/:groupId/edit-a-group/edit-group-cohort', () => {
    it('loads the edit group cohort page with the current cohort', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the group cohort',
        submitButtonText: 'Submit',
        radios: [
          { text: 'General offence', value: 'GENERAL', selected: true },
          {
            text: 'General offence, learning disabilities and challenges (LDC)',
            value: 'GENERAL_LDC',
            selected: false,
          },
          { text: 'Sexual offence', value: 'SEXUAL', selected: false },
          { text: 'Sexual offence, learning disabilities and challenges (LDC)', value: 'SEXUAL_LDC', selected: false },
        ],
      } as EditGroupCohort)

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group EXISTING123')
          expect(res.text).toContain('Edit the group cohort')
          expect(res.text).toContain('General offence')
        })
    })

    it('preselects general offence radio when GENERAL cohort is returned', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the group cohort',
        submitButtonText: 'Submit',
        radios: [
          { text: 'General offence', value: 'GENERAL', selected: true },
          {
            text: 'General offence, learning disabilities and challenges (LDC)',
            value: 'GENERAL_LDC',
            selected: false,
          },
          { text: 'Sexual offence', value: 'SEXUAL', selected: false },
          { text: 'Sexual offence, learning disabilities and challenges (LDC)', value: 'SEXUAL_LDC', selected: false },
        ],
      } as EditGroupCohort)

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toMatch(/<input[^>]*value="GENERAL"[^>]*checked|<input[^>]*checked[^>]*value="GENERAL"/)
        })
    })

    it('loads the edit group cohort page when session createGroupFormData is missing', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the group cohort',
        submitButtonText: 'Submit',
        radios: [
          { text: 'General offence', value: 'GENERAL', selected: true },
          {
            text: 'General offence, learning disabilities and challenges (LDC)',
            value: 'GENERAL_LDC',
            selected: false,
          },
          { text: 'Sexual offence', value: 'SEXUAL', selected: false },
          { text: 'Sexual offence, learning disabilities and challenges (LDC)', value: 'SEXUAL_LDC', selected: false },
        ],
      } as EditGroupCohort)

      const tempApp = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      return request(tempApp)
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
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the group cohort',
        submitButtonText: 'Submit',
        radios: [
          { text: 'General offence', value: 'GENERAL', selected: true },
          {
            text: 'General offence, learning disabilities and challenges (LDC)',
            value: 'GENERAL_LDC',
            selected: false,
          },
          { text: 'Sexual offence', value: 'SEXUAL', selected: false },
          { text: 'Sexual offence, learning disabilities and challenges (LDC)', value: 'SEXUAL_LDC', selected: false },
        ],
      } as EditGroupCohort)
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
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        cohort: 'GENERAL',
      } as GroupDetailsResponse)
      accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort.mockResolvedValue({
        captionText: 'Edit group EXISTING123',
        pageTitle: 'Edit the group cohort',
        submitButtonText: 'Submit',
        radios: [
          { text: 'General offence', value: 'GENERAL', selected: true },
          {
            text: 'General offence, learning disabilities and challenges (LDC)',
            value: 'GENERAL_LDC',
            selected: false,
          },
          { text: 'Sexual offence', value: 'SEXUAL', selected: false },
          { text: 'Sexual offence, learning disabilities and challenges (LDC)', value: 'SEXUAL_LDC', selected: false },
        ],
      } as EditGroupCohort)

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

  describe('GET /group/:groupId/edit-a-group/edit-group-code', () => {
    it('loads the edit group code page with the current code', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
      } as GroupDetailsResponse)

      return request(app)
        .get(`/group/${groupId}/edit-a-group/edit-group-code`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group code')
          expect(res.text).toContain('EXISTING123')
        })
    })

    it('loads the edit group code page when session createGroupFormData is missing', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
      } as GroupDetailsResponse)

      const tempApp = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      return request(tempApp)
        .get(`/group/${groupId}/edit-a-group/edit-group-code`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit group code')
          expect(res.text).toContain('EXISTING123')
        })
    })
  })

  describe('POST /group/:groupId/edit-a-group/edit-group-code', () => {
    it('updates the group code and redirects to group details', async () => {
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: groupId,
        code: 'EXISTING123',
        regionName: 'Test Region',
      })
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({} as never)

      return request(app)
        .post(`/group/${groupId}/edit-a-group/edit-group-code`)
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
      accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion.mockResolvedValue({
        id: randomUUID(),
        code: 'DUPLICATE123',
        regionName: 'Test Region',
      })

      return request(app)
        .post(`/group/${groupId}/edit-a-group/edit-group-code`)
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

  describe('GET /group/:groupId/edit-group-probation-delivery-unit', () => {
    it('loads the edit PDU page with current PDU from group details', async () => {
      const groupDetailsWithPdu = GroupDetailsFactory.build({
        id: groupId,
        code: 'TEST123',
        pduCode: 'PDU-NE',
        pduName: 'North East',
      })

      const pduLocations = [
        { code: 'PDU-NE', description: 'North East' },
        { code: 'PDU-NW', description: 'North West' },
      ]

      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetailsWithPdu)
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue(pduLocations)

      return request(app)
        .get(`/group/${groupId}/edit-group-probation-delivery-unit`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit the probation delivery unit (PDU) where the group will take place')
          expect(accreditedProgrammesManageAndDeliverService.getGroupDetailsById).toHaveBeenCalledWith('user1', groupId)
          expect(accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion).toHaveBeenCalledWith('user1')
        })
    })

    it('displays PDU from session if available', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          pduCode: 'PDU-SW',
          pduName: 'South West',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const pduLocations = [{ code: 'PDU-SW', description: 'South West' }]
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue(pduLocations)

      return request(app)
        .get(`/group/${groupId}/edit-group-probation-delivery-unit`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit the probation delivery unit (PDU) where the group will take place')
        })
    })

    it('loads group details when session has no pduCode', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const groupDetailsWithPdu = GroupDetailsFactory.build({
        id: groupId,
        code: 'TEST123',
        pduCode: 'PDU-NE',
        pduName: 'North East',
      })

      const pduLocations = [{ code: 'PDU-NE', description: 'North East' }]

      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetailsWithPdu)
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue(pduLocations)

      return request(app)
        .get(`/group/${groupId}/edit-group-probation-delivery-unit`)
        .expect(200)
        .expect(() => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupDetailsById).toHaveBeenCalledWith('user1', groupId)
        })
    })
  })

  describe('POST /group/:groupId/edit-group-probation-delivery-unit', () => {
    it('updates PDU and redirects to edit location page on successful submission', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          pduCode: 'PDU-NE',
          pduName: 'North East',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const pduLocations = [{ code: 'PDU-NW', description: 'North West' }]
      accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion.mockResolvedValue(pduLocations)

      return request(app)
        .post(`/group/${groupId}/edit-group-probation-delivery-unit`)
        .type('form')
        .send({ 'create-group-pdu': JSON.stringify({ code: 'PDU-NW', name: 'North West' }) })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/edit-group-delivery-location`)
        })
    })
  })

  describe('GET /group/:groupId/edit-group-delivery-location', () => {
    it('loads the edit location page with current location from group details', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          pduCode: 'PDU-NE',
          pduName: 'North East',
          deliveryLocationCode: 'LOC-1',
          deliveryLocationName: 'HMP Leeds',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const officeLocations = [
        { code: 'LOC-1', description: 'HMP Leeds' },
        { code: 'LOC-2', description: 'HMP Manchester' },
      ]

      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue(officeLocations)

      return request(app)
        .get(`/group/${groupId}/edit-group-delivery-location`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Edit where the group will take place')
          expect(accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu).toHaveBeenCalledWith(
            'user1',
            'PDU-NE',
          )
        })
    })

    it('loads group details when createGroupFormData is undefined', async () => {
      const sessionData: Partial<SessionData> = {}
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const groupDetailsWithLocation = GroupDetailsFactory.build({
        id: groupId,
        code: 'TEST123',
        pduCode: 'PDU-NE',
        pduName: 'North East',
        deliveryLocationCode: 'LOC-1',
        deliveryLocation: 'HMP Leeds',
      })

      const officeLocations = [{ code: 'LOC-1', description: 'HMP Leeds' }]

      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetailsWithLocation)
      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue(officeLocations)

      return request(app)
        .get(`/group/${groupId}/edit-group-delivery-location`)
        .expect(200)
        .expect(() => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupDetailsById).toHaveBeenCalledWith('user1', groupId)
          expect(accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu).toHaveBeenCalledWith(
            'user1',
            'PDU-NE',
          )
        })
    })

    it('loads group details when deliveryLocationCode is undefined in session', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          pduCode: 'PDU-NE',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const groupDetailsWithLocation = GroupDetailsFactory.build({
        id: groupId,
        code: 'TEST123',
        pduCode: 'PDU-NE',
        deliveryLocationCode: 'LOC-1',
        deliveryLocation: 'HMP Leeds',
      })

      const officeLocations = [{ code: 'LOC-1', description: 'HMP Leeds' }]

      accreditedProgrammesManageAndDeliverService.getGroupDetailsById.mockResolvedValue(groupDetailsWithLocation)
      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue(officeLocations)

      return request(app)
        .get(`/group/${groupId}/edit-group-delivery-location`)
        .expect(200)
        .expect(() => {
          expect(accreditedProgrammesManageAndDeliverService.getGroupDetailsById).toHaveBeenCalledWith('user1', groupId)
        })
    })
  })

  describe('POST /group/:groupId/edit-group-delivery-location', () => {
    it('updates location and redirects to group details with success message', async () => {
      const sessionData: Partial<SessionData> = {
        createGroupFormData: {
          groupCode: 'TEST123',
          pduCode: 'PDU-NE',
          pduName: 'North East',
          deliveryLocationCode: 'LOC-1',
          deliveryLocationName: 'HMP Leeds',
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const officeLocations = [
        { code: 'LOC-1', description: 'HMP Leeds' },
        { code: 'LOC-2', description: 'HMP Manchester' },
      ]

      accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu.mockResolvedValue(officeLocations)
      accreditedProgrammesManageAndDeliverService.updateGroup.mockResolvedValue({
        successMessage: 'Group delivery location updated',
      })

      return request(app)
        .post(`/group/${groupId}/edit-group-delivery-location`)
        .type('form')
        .send({ 'create-group-location': JSON.stringify({ code: 'LOC-2', name: 'HMP Manchester' }) })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/${groupId}/group-details`)
          expect(res.text).toContain(encodeURIComponent('Group delivery location updated'))
          expect(accreditedProgrammesManageAndDeliverService.updateGroup).toHaveBeenCalledWith(
            'user1',
            groupId,
            expect.objectContaining({
              deliveryLocationCode: 'LOC-2',
            }),
          )
        })
    })
  })
})
