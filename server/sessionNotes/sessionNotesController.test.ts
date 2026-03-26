import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

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
})

describe('SessionNotesController', () => {
  describe('GET /group/:groupId/session/:sessionId/:sessionSlug-session-notes', () => {
    it('renders session notes from BFF', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue({
        pageTitle: 'Alex River: Getting started 1 Introduction to Building Choices session notes',
        moduleName: 'Getting started',
        sessionName: 'Introduction to Building Choices',
        sessionNumber: 1,
        lastUpdatedBy: 'John Smith',
        lastUpdatedDate: '19 March 2026',
        groupId: 'd193bf89-c98b-4e92-b842-3c1b3e5f5e4a',
        sessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        sessionDate: '21 July 2025',
        sessionAttendance: 'Attended, failed to comply',
        sessionNotes: 'Participant engaged well.\nSecond paragraph.',
      })

      await request(app)
        .get('/group/111/session/6789/getting-started-1-session-notes?referralId=referral-123')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Alex River: Getting started 1 Introduction to Building Choices session notes')
          expect(res.text).toContain('Participant engaged well.\nSecond paragraph.')
          expect(res.text).toContain('Last updated by John Smith on 19 March 2026')
          expect(res.text).toContain('name="sessionNotes"')
        })

      expect(accreditedProgrammesManageAndDeliverService.getSessionNotes).toHaveBeenCalledWith(
        'user1',
        '6789',
        'referral-123',
      )
    })

    it('redirects back to edit session when referralId is missing', async () => {
      await request(app)
        .get('/group/111/session/6789/getting-started-1-session-notes')
        .expect(302)
        .expect('Location', '/group/111/session/6789/edit-session')

      expect(accreditedProgrammesManageAndDeliverService.getSessionNotes).not.toHaveBeenCalled()
    })

    it('returns 404 when BFF returns referral not found', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockRejectedValue({
        status: 404,
        message: 'Referral Not found',
      })

      await request(app)
        .get('/group/111/session/6789/getting-started-1-session-notes?referralId=missing-referral')
        .expect(404)
    })

    it('saves edited notes and redirects back to page', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue({
        pageTitle: 'Alex River: Getting started 1 Introduction to Building Choices session notes',
        moduleName: 'Getting started',
        sessionName: 'Introduction to Building Choices',
        sessionNumber: 1,
        lastUpdatedBy: 'John Smith',
        lastUpdatedDate: '19 March 2026',
        groupId: 'd193bf89-c98b-4e92-b842-3c1b3e5f5e4a',
        sessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        sessionDate: '21 July 2025',
        sessionAttendance: 'Attended, failed to comply',
        sessionNotes: 'Existing note.',
      })

      accreditedProgrammesManageAndDeliverService.getRecordAttendanceBffData.mockResolvedValue({
        sessionTitle: 'Getting started 1',
        groupRegionName: 'North East',
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
          },
        ],
      })

      accreditedProgrammesManageAndDeliverService.createSessionAttendance.mockResolvedValue({
        attendees: [
          {
            referralId: 'referral-123',
            outcomeCode: 'AFTC',
            sessionNotes: 'Updated note',
          },
        ],
      })

      await request(app)
        .post('/group/111/session/6789/getting-started-1-session-notes?referralId=referral-123')
        .send({ sessionNotes: 'Updated note' })
        .expect(302)
        .expect(
          'Location',
          '/group/111/session/6789/getting-started-1-session-notes?referralId=referral-123&saved=true&personOnProbationName=Alex+River',
        )

      expect(accreditedProgrammesManageAndDeliverService.createSessionAttendance).toHaveBeenCalledWith(
        'user1',
        '6789',
        {
          attendees: [
            {
              referralId: 'referral-123',
              outcomeCode: 'AFTC',
              sessionNotes: 'Updated note',
            },
          ],
        },
      )
    })

    it('shows success alert when saved flag is present', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionNotes.mockResolvedValue({
        pageTitle: 'Alex River: Getting started 1 Introduction to Building Choices session notes',
        moduleName: 'Getting started',
        sessionName: 'Introduction to Building Choices',
        sessionNumber: 1,
        lastUpdatedBy: 'John Smith',
        lastUpdatedDate: '19 March 2026',
        groupId: 'd193bf89-c98b-4e92-b842-3c1b3e5f5e4a',
        sessionId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        sessionDate: '21 July 2025',
        sessionAttendance: 'Attended, failed to comply',
        sessionNotes: 'Participant engaged well.',
      })

      await request(app)
        .get(
          '/group/111/session/6789/getting-started-1-session-notes?referralId=referral-123&saved=true&personOnProbationName=Alex+River',
        )
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Attendance recorded for Alex River')
          expect(res.text).toContain('moj-alert')
        })
    })
  })
})
