import { randomUUID } from 'crypto'
import request from 'supertest'

import { ReferralDetails } from '@manage-and-deliver-api'
import { Express } from 'express'
import { SessionData } from 'express-session'
import { appWithAllRoutes, user as defaultUser } from '../routes/testutils/appSetup'
import sendAuditEvent from '../services/auditService'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import TestUtils from '../testutils/testUtils'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
jest.mock('../services/auditService')
const hmppsAuthClientBuilder = jest.fn()

const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

const referralDetails: ReferralDetails = referralDetailsFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})
beforeEach(() => {
  app = appWithAllRoutes({
    services: {
      accreditedProgrammesManageAndDeliverService,
    },
  })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
})

describe('Update ldc status', () => {
  describe(`GET /referral/:referralId/update-learning-disabilities-and-challenges`, () => {
    it('calls the API with the correct params', async () => {
      const referralId = randomUUID()

      return request(app)
        .get(`/referral/${referralId}/update-learning-disabilities-and-challenges`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(referralDetails.hasLdcDisplayText)
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'VIEW_UPDATE_LDC',
            defaultUser.username,
            referralDetails.crn,
            'CRN',
            {
              referralId,
            },
          )
        })
    })
  })

  describe(`POST /referral/:referralId/update-learning-disabilities-and-challenges`, () => {
    it('posts to the update ldc page and redirects successfully', async () => {
      const referralId = randomUUID()

      return request(app)
        .post(`/referral/${referralId}/update-learning-disabilities-and-challenges`)
        .type('form')
        .send({
          hasLdc: true,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('?isLdcUpdated=true')
        })
        .then(() => {
          expect(sendAuditEvent).toHaveBeenCalledWith(
            'EDIT_REFERRAL_LDC',
            defaultUser.username,
            referralDetails.crn,
            'CRN',
            {
              referralId,
              hasLdc: 'true',
            },
          )
        })
    })

    it('keeps LDC updates scoped per referral when multiple tabs are open', async () => {
      const referralIdA = randomUUID()
      const referralIdB = randomUUID()
      const originPageA = `/referral/${referralIdA}/availability-and-motivation/availability`
      const originPageB = `/referral/${referralIdB}/availability-and-motivation/location`

      const sessionData: Partial<SessionData> = {
        originPage: '/referral-details/unrelated-referral/personal-details',
        referralOriginPages: {
          [referralIdA]: originPageA,
          [referralIdB]: originPageB,
        },
      }

      const appWithReferralOriginMap = TestUtils.createTestAppWithSession(sessionData, {
        accreditedProgrammesManageAndDeliverService,
      })

      const agent = request.agent(appWithReferralOriginMap)

      await agent
        .post(`/referral/${referralIdA}/update-learning-disabilities-and-challenges`)
        .type('form')
        .send({ hasLdc: true })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to ${originPageA}?isLdcUpdated=true`)
        })

      await agent
        .post(`/referral/${referralIdB}/update-learning-disabilities-and-challenges`)
        .type('form')
        .send({ hasLdc: false })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(`Redirecting to ${originPageB}?isLdcUpdated=true`)
        })

      expect(accreditedProgrammesManageAndDeliverService.updateLdc).toHaveBeenNthCalledWith(
        1,
        'user1',
        referralIdA,
        'true',
      )
      expect(accreditedProgrammesManageAndDeliverService.updateLdc).toHaveBeenNthCalledWith(
        2,
        'user1',
        referralIdB,
        'false',
      )
    })
  })
})
