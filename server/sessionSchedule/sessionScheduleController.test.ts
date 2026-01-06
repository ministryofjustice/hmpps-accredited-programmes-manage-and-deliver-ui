import { ModuleSessionTemplate } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import { SessionData } from 'express-session'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import TestUtils from '../testutils/testUtils'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express
const groupId = randomUUID()
const moduleId = randomUUID()

const mockSessionTemplates: ModuleSessionTemplate[] = [
  {
    id: randomUUID(),
    number: 1,
    name: 'Getting started one-to-one',
  },
  {
    id: randomUUID(),
    number: 2,
    name: 'Session 2',
  },
]

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  const sessionData: Partial<SessionData> = {
    sessionScheduleWhichData: {},
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockSessionTemplates)
})

describe('Session Schedule Controller', () => {
  describe('GET /group/:groupId/module/:moduleId/schedule-session-type', () => {
    it('loads the session schedule which page', async () => {
      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a Getting started one-to-one')
          expect(accreditedProgrammesManageAndDeliverService.getSessionTemplates).toHaveBeenCalledWith(
            'user1',
            groupId,
            moduleId,
          )
        })
    })

    it('displays all available session templates', async () => {
      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Getting started one-to-one')
          expect(res.text).toContain('Session 2')
        })
    })

    it('displays previously selected session template from session', async () => {
      const selectedTemplateId = mockSessionTemplates[1].id
      const sessionData: Partial<SessionData> = {
        sessionScheduleWhichData: {
          sessionScheduleTemplateId: selectedTemplateId,
        },
      }
      app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue(mockSessionTemplates)

      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`value="${selectedTemplateId}" checked`)
        })
    })

    it('displays fallback text when no session templates are available', async () => {
      accreditedProgrammesManageAndDeliverService.getSessionTemplates.mockResolvedValue([])

      return request(app)
        .get(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Schedule a the session')
        })
    })
  })

  describe('POST /group/:groupId/module/:moduleId/schedule-session-type', () => {
    it('redirects to session details page on successful submission', async () => {
      const selectedTemplateId = mockSessionTemplates[0].id

      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .send({ 'session-template': selectedTemplateId })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to /${groupId}/${moduleId}/schedule-group-session-details`)
        })
    })

    it('shows validation error when no session template is selected', async () => {
      return request(app)
        .post(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .send({})
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select a session')
          expect(res.text).toContain('There is a problem')
        })
    })

    it('does not redirect when validation fails', async () => {
      const response = await request(app)
        .post(`/group/${groupId}/module/${moduleId}/schedule-session-type`)
        .send({})
        .expect(400)

      expect(response.text).not.toContain('Redirecting')
      expect(response.text).toContain('Getting started one-to-one')
    })
  })
})
