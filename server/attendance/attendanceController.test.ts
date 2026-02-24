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
  const sessionData: Partial<SessionData> = {
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
    it('should fetch session details with correct parameters and load page correctly', async () => {
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
          expect(res.text).toContain(`Redirecting to /group/111/session/6789/referral/referral1`)
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
