import { Express } from 'express'
import request from 'supertest'
import { SessionData } from 'express-session'
import { SessionNotes } from '@manage-and-deliver-api'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'
import TestUtils from '../testutils/testUtils'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../services/auditService')
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
})

const sessionNotesFactory = (overrides: Partial<SessionNotes> = {}): SessionNotes => ({
  personName: `Alex River`,
  pageTitle: 'Alex River: Getting started Introduction to Building Choices session notes',
  moduleName: 'Getting started',
  sessionName: 'Introduction to Building Choices',
  sessionNumber: 1,
  sessionNotesCreatedByFullName: 'John Smith',
  lastUpdatedDate: '19 March 2026',
  groupId: 'd193bf89-c98b-4e92-b842-3c1b3e5f5e4a',
  sessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  sessionDate: '21 July 2025',
  sessionAttendance: 'Attended, failed to comply',
  sessionNotes: 'Participant engaged well.\nSecond paragraph.',
  ...overrides,
})

describe('SessionNotesController', () => {
  describe('GET /:groupId/:sessionId/:sessionSlug-attendance-and-session-notes', () => {
    it('renders session notes from BFF', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(sessionNotesFactory())

      await request(app)
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Alex River: Getting started Introduction to Building Choices session notes')
          expect(res.text).toContain('Participant engaged well.<br/>Second paragraph.')
          expect(res.text).toContain('Last updated by John Smith on 19 March 2026')
          expect(res.text).toContain('21 July 2025')
        })

      expect(accreditedProgrammesManageAndDeliverService.getSessionNotes).toHaveBeenCalledWith(
        'user1',
        '6789',
        'referral-123',
      )

      expect(sendAuditEvent).toHaveBeenCalledWith(
        'VIEW_SESSION_NOTES_DATA',
        'user1',
        '6789',
        'SEARCH_TERM',
        expect.objectContaining({ referralId: 'referral-123' }),
      )
    })

    it('redirects back to edit session when referralId is missing', async () => {
      await request(app)
        .get('/111/6789/getting-started-1-attendance-and-session-notes')
        .expect(302)
        .expect('Location', '/111/6789/edit-session')

      expect(accreditedProgrammesManageAndDeliverService.getSessionNotes).not.toHaveBeenCalled()
    })

    it('returns 404 when BFF returns referral not found', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockRejectedValue({
        status: 404,
        message: 'Referral Not found',
      })

      await request(app)
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=missing-referral')
        .expect(404)
    })

    it('seeds attendance selection and redirects to record attendance on POST', async () => {
      await request(app)
        .post('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&source=edit-session')
        .send({ sessionNotes: 'Updated note' })
        .expect(302)
        .expect('Location', '/111/6789/record-attendance')

      expect(accreditedProgrammesManageAndDeliverService.createSessionAttendance).not.toHaveBeenCalled()
    })

    it('scopes seeded selection to the posted referral so record attendance opens for that person', async () => {
      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue({
        sessionTitle: 'Introduction to Building Choices',
        sessionModule: 'Getting started 1',
        groupRegionName: 'North East',
        isCatchup: false,
        people: [
          {
            referralId: 'referral-123',
            name: 'Alex River',
            crn: 'X12345',
            attendance: {
              code: 'AFTC',
              text: 'Attended, failed to comply',
            },
            sessionNotes: 'Existing note.',
            options: [],
            isLao: false,
            isExcluded: false,
          },
        ],
      })

      const agent = request.agent(app)

      await agent
        .post('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123')
        .send({ sessionNotes: 'Updated note' })
        .expect(302)
        .expect('Location', '/111/6789/record-attendance')

      await agent.get('/111/6789/record-attendance').expect(200)

      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral-123'],
      )
    })

    it('shows success alert when saved flag is present', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(sessionNotesFactory())

      await request(app)
        .get(
          '/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&saved=true&personOnProbationName=Alex+River',
        )
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Attendance recorded for Alex River')
          expect(res.text).toContain('moj-alert')
        })
    })

    it('shows no notes added message when session notes are blank', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(
        sessionNotesFactory({
          sessionNotes: null,
        }),
      )

      await request(app)
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('No notes added')
          expect(res.text).not.toContain('id="sessionNotes"')
          expect(res.text).not.toContain('name="sessionNotes"')
        })
    })

    it('uses attendance history backlink when opened from PoP attendance history', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(sessionNotesFactory())

      await request(app)
        .get(
          '/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&isAttendanceHistory=true',
        )
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('/referral/referral-123/attendance-history')
          expect(res.text).toContain('Back to Attendance history')
        })
    })

    it('uses edit session backlink when opened from edit session', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(sessionNotesFactory())

      await request(app)
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&source=edit-session')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(
            '/d193bf89-c98b-4e92-b842-3c1b3e5f5e4a/a1b2c3d4-e5f6-7890-abcd-ef1234567890/getting-started-1',
          )
          expect(res.text).toContain('Back to Getting started')
        })
    })

    it('renders notes as body text and links to record attendance when opened from edit session', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(
        sessionNotesFactory({
          sessionAttendance: '',
          sessionNotes: 'Participant engaged well.',
        }),
      )

      await request(app)
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&source=edit-session')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('<p class="govuk-body-m">Participant engaged well.</p>')
          expect(res.text).not.toContain('id="sessionNotes"')
          expect(res.text).toContain(
            '/d193bf89-c98b-4e92-b842-3c1b3e5f5e4a/a1b2c3d4-e5f6-7890-abcd-ef1234567890/record-attendance?referralId=referral-123',
          )
        })
    })

    it('seeds referral ids so record attendance can be opened from edit session notes', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(sessionNotesFactory())

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue({
        sessionTitle: 'Introduction to Building Choices',
        sessionModule: 'Getting started 1',
        groupRegionName: 'North East',
        isCatchup: false,
        people: [
          {
            referralId: 'referral-123',
            name: 'Alex River',
            crn: 'X12345',
            attendance: {
              code: 'AFTC',
              text: 'Attended, failed to comply',
            },
            sessionNotes: 'Participant engaged well.',
            options: [],
            isLao: false,
            isExcluded: false,
          },
        ],
      })

      const agent = request.agent(app)

      await agent
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&source=edit-session')
        .expect(200)

      await agent
        .get('/111/6789/record-attendance')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Alex River')
        })

      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral-123'],
      )
    })

    it('scopes selection to clicked referral when opened from edit session notes', async () => {
      const sessionData: Partial<SessionData> = {
        editSessionAttendance: {
          referralIds: ['referral-999'],
          attendees: [{ referralId: 'referral-999', outcomeCode: 'ATTC', sessionNotes: '' }],
        },
      }

      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })

      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue(sessionNotesFactory())

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue({
        sessionTitle: 'Introduction to Building Choices',
        sessionModule: 'Getting started 1',
        groupRegionName: 'North East',
        isCatchup: false,
        people: [
          {
            referralId: 'referral-123',
            name: 'Alex River',
            crn: 'X12345',
            attendance: {
              code: 'AFTC',
              text: 'Attended, failed to comply',
            },
            sessionNotes: 'Participant engaged well.',
            options: [],
            isLao: false,
            isExcluded: false,
          },
          {
            referralId: 'referral-999',
            name: 'Taylor Smith',
            crn: 'X67890',
            attendance: {
              code: 'ATTC',
              text: 'Attended',
            },
            sessionNotes: '',
            options: [],
            isLao: false,
            isExcluded: false,
          },
        ],
      })

      const agent = request.agent(app)

      await agent
        .get('/111/6789/getting-started-1-attendance-and-session-notes?referralId=referral-123&source=edit-session')
        .expect(200)

      await agent
        .get('/111/6789/record-attendance?referralId=referral-123')
        .expect(302)
        .expect('Location', '/111/6789/referral/referral-123/getting-started-1-session-notes')

      expect(accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData).toHaveBeenCalledWith(
        'user1',
        '6789',
        ['referral-123'],
      )
    })
  })
})
