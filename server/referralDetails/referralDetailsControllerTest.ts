import { PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')

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

describe(`GET /referral-details/:id/personal-details`, () => {
  it('calls api to get referral details with personal details', async () => {
    const referralDetails: ReferralDetails = referralDetailsFactory.build()
    const personalDetails: PersonalDetails = personalDetailsFactory.build()
    accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
    accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)
    return request(app)
      .get(`/referral-details/${randomUUID()}/personal-details`)
      .expect(200)
      .expect(res => {
        expect(res.text).toContain(`${referralDetails.crn}`)
        expect(res.text).toContainEqual(referralDetails.personName)
        expect(res.text).toContain(personalDetails.probationDeliveryUnit)
      })
  })
})
