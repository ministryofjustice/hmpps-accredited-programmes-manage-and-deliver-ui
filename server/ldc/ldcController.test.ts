import { randomUUID } from 'crypto'
import request from 'supertest'

import { ReferralDetails } from '@manage-and-deliver-api'
import { Express } from 'express'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../data/hmppsAuthClient')
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
  describe(`GET /referral/:referralId/update-ldc`, () => {
    it('calls the API with the correct params', async () => {
      const referralId = randomUUID()

      return request(app)
        .get(`/referral/${referralId}/update-ldc`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(referralDetails.hasLdcDisplayText)
        })
    })
  })

  describe(`POST /referral/:referralId/update-ldc`, () => {
    it('posts to the update ldc page and redirects successfully', async () => {
      const referralId = randomUUID()

      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)

      return request(app)
        .post(`/referral/${referralId}/update-ldc`)
        .type('form')
        .send({
          hasLdc: true,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain('?isLdcUpdated=true')
        })
    })
  })
})
