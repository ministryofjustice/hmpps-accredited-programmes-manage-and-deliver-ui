import { randomUUID } from 'crypto'
import request from 'supertest'

import { CohortEnum, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { Express } from 'express'
import { SessionData } from 'express-session'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import TestUtils from '../testutils/testUtils'

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
  const sessionData: Partial<SessionData> = {
    originPage: '/referral-details/1/personal-details',
  }
  app = TestUtils.createTestAppWithSession(sessionData, { accreditedProgrammesManageAndDeliverService })
  accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
})

describe('Update cohort', () => {
  describe(`GET /referral/:referralDetails.id/update-cohort`, () => {
    it('calls the API with the correct params', async () => {
      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)
      return request(app)
        .get(`/referral/${referralDetails.id}/change-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(referralDetails.cohort)
        })
    })
  })

  describe(`POST /referral/:referralDetails.id/update-cohort`, () => {
    it('posts to the update cohort page and redirects successfully', async () => {
      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)

      return request(app)
        .post(`/referral/${referralDetails.id}/change-cohort`)
        .type('form')
        .send({
          cohort: 'GENERAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral-details/${referralDetails.id}/personal-details?isCohortUpdated=true`,
          )
        })
    })
  })
})
