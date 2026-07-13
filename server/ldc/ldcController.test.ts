import { randomUUID } from 'crypto'
import request from 'supertest'

import { ReferralDetails } from '@manage-and-deliver-api'
import { Express } from 'express'
import { appWithAllRoutes, user as defaultUser } from '../routes/testutils/appSetup'
import sendAuditEvent from '../services/auditService'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'

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
              referralId: expect.any(String),
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
  })
})
