import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../testutils/testUtils'
import recordSessionAttendanceFactory from '../testutils/factories/recordSessionAttendanceFactory'

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
  const sessionData: Partial<SessionData> = {}
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
})

describe('showRecordAttendancePage', () => {
  let sessionData: Partial<SessionData> = {
    editSessionAttendance: {
      referralIds: ['referral1'],
    },
  }

  describe('GET /group/:groupId/session/:sessionId/record-attendance', () => {
    it('should fetch attendance options and load page correctly', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build()
      bffData.people = [bffData.people[0]]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get(`/group/111/session/6789/record-attendance`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Did ${bffData.people[0].name} attend Getting started 1?`)
        })
      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral1'],
      )
    })
  })

  describe('POST /group/:groupId/session/:sessionId/record-attendance', () => {
    it('should fetch session details with correct parameters and load page correctly for a single attendee', async () => {
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build()
      bffData.people = [bffData.people[0]]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      const { referralId } = bffData.people[0]

      return request(app)
        .post(`/group/111/session/6789/record-attendance`)
        .type('form')
        .send({
          [`attendance-${referralId}`]: 'ATTC',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/111/session/6789/referral/${referralId}`)
        })
    })

    it('should fetch session details with correct parameters and load page correctly for a multiple attendees', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1', 'referral2'],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build()
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
      const firstReferralId = bffData.people[0].referralId

      const body = bffData.people
        .map(person => ({ [`attendance-${person.referralId}`]: 'ATTC' }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})

      await request(app)
        .post(`/group/111/session/6789/record-attendance`)
        .type('form')
        .send(body)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /group/111/session/6789/referral/${firstReferralId}`)
        })
      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral1', 'referral2'],
      )
    })
  })

  it('Calling with incorrect parameters returns a 400 and reloads the page with errors', async () => {
    app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

    const bffData = recordSessionAttendanceFactory.build()
    bffData.people = [bffData.people[0]]

    accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

    return request(app)
      .post(`/group/111/session/6789/record-attendance`)
      .type('form')
      .send({})
      .expect(400)
      .expect(res => {
        expect(res.text).toContain(`Select an attendance status for ${bffData.people[0].name}`)
      })
  })
})

describe('showRecordAttendanceNotesPage', () => {
  it('submits selected attendance outcome together with notes', async () => {
    const sessionData: Partial<SessionData> = {
      editSessionAttendance: {
        referralIds: ['referral1'],
      },
    }

    app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

    const bffData = recordSessionAttendanceFactory.build({
      sessionTitle: 'Getting started 1',
      people: [
        {
          referralId: 'referral1',
          name: 'Alex Example',
          crn: 'A123456',
          options: [
            { text: 'Yes - attended', value: 'ATTC' },
            { text: 'No - did not attend', value: 'UAAB' },
          ],
        },
      ],
    })

    accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
    accreditedProgrammesManageAndDeliverService.postSessionAttendance.mockResolvedValue()

    const agent = request.agent(app)

    await agent
      .post('/group/111/session/6789/record-attendance')
      .type('form')
      .send({
        'attendance-referral1': 'UAAB',
      })
      .expect(302)

    await agent
      .post('/group/111/session/6789/referral/referral1/getting-started-1-session-notes')
      .type('form')
      .send({
        'record-session-attendance-notes': 'not attended due to transport issues',
        'attendance-notes-action': 'continue',
      })
      .expect(302)

    expect(accreditedProgrammesManageAndDeliverService.postSessionAttendance).toHaveBeenCalledWith('user1', '6789', {
      attendees: [
        {
          referralId: 'referral1',
          outcomeCode: 'UAAB',
          sessionNotes: 'not attended due to transport issues',
        },
      ],
    })
  })

  it('submits attendance payload when skip is selected on the final referral', async () => {
    const sessionData: Partial<SessionData> = {
      editSessionAttendance: {
        referralIds: ['referral1', 'referral2'],
        attendees: [
          { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'existing note' },
          { referralId: 'referral2', outcomeCode: 'ATTC' },
        ],
      },
    }

    app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

    const bffData = recordSessionAttendanceFactory.build({
      sessionTitle: 'Getting started 1',
      people: [
        {
          referralId: 'referral1',
          name: 'Alex Example',
          crn: 'A123456',
          options: [{ text: 'Yes - attended', value: 'ATTC' }],
        },
        {
          referralId: 'referral2',
          name: 'Sam Example',
          crn: 'A654321',
          options: [{ text: 'Attended but failed to comply', value: 'ATTC' }],
        },
      ],
    })

    accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
    accreditedProgrammesManageAndDeliverService.postSessionAttendance.mockResolvedValue()

    await request(app)
      .post('/group/111/session/6789/referral/referral2/getting-started-1-session-notes')
      .type('form')
      .send({
        'record-session-attendance-notes': 'skip submit note',
        'attendance-notes-action': 'skip',
      })
      .expect(302)
      .expect(res => {
        expect(res.headers.location).toEqual(
          '/group/111/session/6789/edit-session?message=Attendance%20and%20session%20notes%20updated',
        )
      })

    expect(accreditedProgrammesManageAndDeliverService.postSessionAttendance).toHaveBeenCalledWith('user1', '6789', {
      attendees: [
        { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'existing note' },
        { referralId: 'referral2', outcomeCode: 'ATTC', sessionNotes: 'skip submit note' },
      ],
    })
  })
})
