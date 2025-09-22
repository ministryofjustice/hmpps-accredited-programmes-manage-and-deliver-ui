import { randomUUID } from 'crypto'
import request from 'supertest'

import { CohortEnum, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { Express } from 'express'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
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

describe('Update cohort', () => {
  describe(`GET /referral/:referralId/update-cohort`, () => {
    it('calls the API with the correct params', async () => {
      const referralId = randomUUID()

      accreditedProgrammesManageAndDeliverService.updateCohort.mockResolvedValue(referralDetails)
      return request(app)
        .get(`/referral/${referralId}/change-cohort`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(referralDetails.cohort)
        })
    })
  })

  describe(`POST /referral/:referralId/update-cohort`, () => {
    it('posts to the update cohort page and redirects successfully', async () => {
      const referralId = randomUUID()

      const personalDetails: PersonalDetails = personalDetailsFactory.build()

      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)

      return request(app)
        .post(`/referral/${referralId}/change-cohort`)
        .type('form')
        .send({
          cohort: 'GENERAL_OFFENCE' as CohortEnum,
        })
        .expect(302)
        .expect(res => {
          expect(res.text).toContain(
            `Redirecting to /referral-details/${referralId}/personal-details?isCohortUpdated=true`,
          )
        })
    })
  })
})
