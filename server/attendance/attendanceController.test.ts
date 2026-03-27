import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../testutils/testUtils'
import recordSessionAttendanceFactory from '../testutils/factories/recordSessionAttendanceFactory'
import { convertToUrlFriendlyKebabCase } from '../utils/utils'

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
    it('redirects to edit session when referralIds are missing from session state', async () => {
      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .get('/group/111/session/6789/record-attendance')
        .expect(302)
        .expect('Location', '/group/111/session/6789/edit-session')

      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).not.toHaveBeenCalled()
    })

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

    it('persists staged attendance radio selection from session', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'AFTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build()
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
      ]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/record-attendance')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('value="AFTC" checked')
        })
    })
  })

  describe('POST /group/:groupId/session/:sessionId/record-attendance', () => {
    it('redirects to edit session when referralIds are missing from session state', async () => {
      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })

      await request(app)
        .post('/group/111/session/6789/record-attendance')
        .type('form')
        .send({ 'attendance-referral1': 'ATTC' })
        .expect(302)
        .expect('Location', '/group/111/session/6789/edit-session')

      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).not.toHaveBeenCalled()
    })

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
          expect(res.text).toContain(
            `Redirecting to /group/111/session/6789/referral/referral1/${convertToUrlFriendlyKebabCase(bffData.sessionTitle)}-session-notes`,
          )
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

      const body = bffData.people
        .map(person => ({ [`attendance-${person.referralId}`]: 'ATTC' }))
        .reduce((acc, curr) => ({ ...acc, ...curr }), {})

      await request(app)
        .post(`/group/111/session/6789/record-attendance`)
        .type('form')
        .send(body)
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/111/session/6789/referral/referral1/${convertToUrlFriendlyKebabCase(bffData.sessionTitle)}-session-notes`,
          )
        })
      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral1', 'referral2'],
      )
    })

    it('preserves staged notes when returning to record-attendance and submitting again', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Keep this note' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          sessionNotes: '',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
      ]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .post('/group/111/session/6789/record-attendance')
        .type('form')
        .send({
          'attendance-referral1': 'AFTC',
        })
        .expect(302)

      await request(app)
        .get('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Keep this note')
        })
    })
  })

  describe('GET /group/:groupId/session/:sessionId/referral/:referralId', () => {
    it('redirects to the canonical notes URL when group title slug is missing', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Getting started 1' })
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral1')
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /group/111/session/6789/referral/referral1/${convertToUrlFriendlyKebabCase(bffData.sessionTitle)}-session-notes`,
          )
        })
    })

    it('handles single referralIds stored as a string without crashing', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: 'referral1' as unknown as string[],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
      ]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Submit')
          expect(res.text).toContain('Attendance')
          expect(res.text).toContain('Attended')
        })

      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral1'],
      )
    })

    it('shows existing DB session notes when revisiting notes page and hides Skip and add later when notes exist', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          sessionNotes: 'Existing note from DB',
        },
      ]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Existing note from DB')
          expect(res.text).not.toContain('Skip and add later')
        })
    })

    it('keeps a cleared staged note empty when revisiting, even if BFF has older notes', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          sessionNotes: 'Old note from BFF',
        },
      ]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).not.toContain('Old note from BFF')
        })
    })

    it('shows Continue and Skip and add later for a non-last referral when notes are empty', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1', 'referral2'],
          attendees: [
            { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' },
            { referralId: 'referral2', outcomeCode: 'ATTC', sessionNotes: '' },
          ],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Continue')
          expect(res.text).toContain('Skip and add later')
        })
    })

    it('shows Skip and add later on last referral when there are multiple attendees', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1', 'referral2'],
          attendees: [
            { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' },
            { referralId: 'referral2', outcomeCode: 'ATTC', sessionNotes: '' },
          ],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
        {
          ...bffData.people[1],
          referralId: 'referral2',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
      ]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral2/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Submit')
          expect(res.text).toContain('Skip and add later')
        })
    })

    it('shows Skip and add later on last referral for a single attendee', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
      ]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Submit')
          expect(res.text).toContain('Skip and add later')
        })
    })

    it('back link on second referral points to previous referral notes', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1', 'referral2'],
          attendees: [
            { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' },
            { referralId: 'referral2', outcomeCode: 'ATTC', sessionNotes: '' },
          ],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Pre-group one-to-one' })
      bffData.people = [
        {
          ...bffData.people[0],
          referralId: 'referral1',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
        {
          ...bffData.people[1],
          referralId: 'referral2',
          attendance: { text: 'Attended', code: 'ATTC' },
        },
      ]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .get('/group/111/session/6789/referral/referral2/pre-group-one-to-one-session-notes')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('/group/111/session/6789/referral/referral1/pre-group-one-to-one-session-notes')
          expect(res.text).toContain('/group/111/session/6789/record-attendance')
        })
    })
  })

  describe('POST /group/:groupId/session/:sessionId/referral/:referralId/:groupTitle-session-notes', () => {
    it('returns 400 when session notes exceed 10000 characters', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Getting started 1' })
      bffData.people = [{ ...bffData.people[0], referralId: 'referral1', name: 'Alice Brown' }]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)

      await request(app)
        .post('/group/111/session/6789/referral/referral1/getting-started-1-session-notes')
        .type('form')
        .send({
          'record-session-attendance-notes': 'a'.repeat(10001),
        })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Session notes must be 10,000 characters or fewer')
        })

      expect(accreditedProgrammesManageAndDeliverService.createSessionAttendance).not.toHaveBeenCalled()
    })

    it('submits attendance and redirects to edit session on the last referral', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Getting started 1' })
      bffData.people = [{ ...bffData.people[0], referralId: 'referral1', name: 'Alice Brown' }]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
      accreditedProgrammesManageAndDeliverService.createSessionAttendance.mockResolvedValue({
        attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Some notes' }],
        responseMessage: 'Attendance updated',
      })

      await request(app)
        .post('/group/111/session/6789/referral/referral1/getting-started-1-session-notes')
        .type('form')
        .send({
          'record-session-attendance-notes': 'Some notes',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            'Redirecting to /group/111/session/6789/edit-session?message=Attendance%20recorded%20for%20Alice%20Brown.',
          )
        })

      expect(accreditedProgrammesManageAndDeliverService.createSessionAttendance).toHaveBeenCalledWith(
        'user1',
        '6789',
        {
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Some notes' }],
        },
      )
    })

    it('skip and add later submits attendance without changing existing notes', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Existing note' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Getting started 1' })
      bffData.people = [
        { ...bffData.people[0], referralId: 'referral1', name: 'Alice Brown', sessionNotes: 'Existing note' },
      ]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
      accreditedProgrammesManageAndDeliverService.createSessionAttendance.mockResolvedValue({
        attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Existing note' }],
        responseMessage: 'Attendance updated',
      })

      await request(app)
        .post('/group/111/session/6789/referral/referral1/getting-started-1-session-notes')
        .type('form')
        .send({
          action: 'skip-and-add-later',
          'record-session-attendance-notes': 'A new unsaved note',
        })
        .expect(302)

      expect(accreditedProgrammesManageAndDeliverService.createSessionAttendance).toHaveBeenCalledWith(
        'user1',
        '6789',
        {
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Existing note' }],
        },
      )
    })

    it('submits an explicit empty session note when user clears existing notes and submits', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1'],
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: 'Existing note' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Getting started 1' })
      bffData.people = [
        { ...bffData.people[0], referralId: 'referral1', name: 'Alice Brown', sessionNotes: 'Existing note' },
      ]
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
      accreditedProgrammesManageAndDeliverService.createSessionAttendance.mockResolvedValue({
        attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        responseMessage: 'Attendance updated',
      })

      await request(app)
        .post('/group/111/session/6789/referral/referral1/getting-started-1-session-notes')
        .type('form')
        .send({
          'record-session-attendance-notes': '',
        })
        .expect(302)

      expect(accreditedProgrammesManageAndDeliverService.createSessionAttendance).toHaveBeenCalledWith(
        'user1',
        '6789',
        {
          attendees: [{ referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      )
    })

    it('formats success message correctly when submitting attendance for multiple attendees', async () => {
      sessionData = {
        editSessionAttendance: {
          referralIds: ['referral1', 'referral2', 'referral3'],
          attendees: [
            { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' },
            { referralId: 'referral2', outcomeCode: 'ATTC', sessionNotes: '' },
            { referralId: 'referral3', outcomeCode: 'ATTC', sessionNotes: '' },
          ],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      const bffData = recordSessionAttendanceFactory.build({ sessionTitle: 'Getting started 1' })
      bffData.people = [
        { ...bffData.people[0], referralId: 'referral1', name: 'Sham Booth' },
        { ...bffData.people[1], referralId: 'referral2', name: 'Adrian Poole' },
        { ...bffData.people[0], referralId: 'referral3', name: 'Alex River' },
      ]

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue(bffData)
      accreditedProgrammesManageAndDeliverService.createSessionAttendance.mockResolvedValue({
        attendees: [
          { referralId: 'referral1', outcomeCode: 'ATTC', sessionNotes: '' },
          { referralId: 'referral2', outcomeCode: 'ATTC', sessionNotes: '' },
          { referralId: 'referral3', outcomeCode: 'ATTC', sessionNotes: '' },
        ],
        responseMessage: 'Attendance saved for session 80424fbb-464f-4bb3-8fb0-9b32e107c7b9.',
      })

      await request(app)
        .post('/group/111/session/6789/referral/referral3/getting-started-1-session-notes')
        .type('form')
        .send({
          'record-session-attendance-notes': '',
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            'Redirecting to /group/111/session/6789/edit-session?message=Attendance%20recorded%20for%20Sham%20Booth%2C%20Adrian%20Poole%20and%20Alex%20River.',
          )
        })
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
