import { Availability, PersonalDetails, ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import personalDetailsFactory from '../testutils/factories/personalDetailsFactory'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import TestUtils from '../testutils/testUtils'
import AddAvailabilityForm from './addAvailability/AddAvailabilityForm'
import availabilityFactory from '../testutils/factories/availabilityFactory'

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

//  function referralDetailsAssertions(res: request.SuperAgentStatic.Response){
//   const referralDetails: ReferralDetails = referralDetailsFactory.build()
//   expect(res.text).toContain(`${referralDetails.crn}`)
//   expect(res.text).toContain(referralDetails.personName)
// }

describe('referral-details', () => {
  // const referralDetails: ReferralDetails = referralDetailsFactory.build()
  // const personalDetails: PersonalDetails = personalDetailsFactory.build()
  //
  //
  //
  // const subNavUrls: { name: string, url: string }[] = [
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/personal-details`,
  //   },
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/programme-history`,
  //   },
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/offence-history`,
  //   },
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/sentence-information`,
  //   },
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/availability`,
  //   },
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/location`,
  //   },
  //   {
  //     name: 'personal-details',
  //     url: `/referral-details/${randomUUID()}/additional-information`,
  //   },
  // ]
  //
  // test.each(subNavUrls)('for subnav "$name"', async ({ url }) => {
  //   accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
  //   accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)
  //   await request(app)
  //     .get(url)
  //     .expect(200)
  //     .expect(res => {
  //       expect(res.text).toContain(referralDetails.crn)
  //       expect(res.text).toContain(referralDetails.personName)
  //     })
  // })

  describe(`GET /referral-details/:id/personal-details`, () => {
    it('loads the referral details page with personal details sub-nav', async () => {
      const referralDetails: ReferralDetails = referralDetailsFactory.build()
      const personalDetails: PersonalDetails = personalDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
      accreditedProgrammesManageAndDeliverService.getPersonalDetails.mockResolvedValue(personalDetails)
      return request(app)
        .get(`/referral-details/${randomUUID()}/personal-details`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain(personalDetails.probationDeliveryUnit)
        })
    })
  })

  describe(`GET /referral-details/:id/programme-history`, () => {
    it('loads the referral details page with programme history sub-nav', async () => {
      const referralDetails: ReferralDetails = referralDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
      return request(app)
        .get(`/referral-details/${randomUUID()}/programme-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('Programme History')
        })
    })
  })

  describe(`GET /referral-details/:id/offence-history`, () => {
    it('loads the referral details page with offence history sub-nav', async () => {
      const referralDetails: ReferralDetails = referralDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
      return request(app)
        .get(`/referral-details/${randomUUID()}/offence-history`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('offence-history')
        })
    })
  })

  describe(`GET /referral-details/:id/sentence-information`, () => {
    it('loads the referral details page with sentence information sub-nav', async () => {
      const referralDetails: ReferralDetails = referralDetailsFactory.build()
      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
      return request(app)
        .get(`/referral-details/${randomUUID()}/sentence-information`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('sentence-information')
        })
    })
  })

  describe(`GET /referral-details/:id/availability`, () => {
    it('loads the referral details page with availability sub-nav', async () => {
      const referralDetails: ReferralDetails = referralDetailsFactory.build()
      const availability: Availability = availabilityFactory.defaultAvailability().build()

      accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValue(referralDetails)
      accreditedProgrammesManageAndDeliverService.getAvailability.mockResolvedValue(availability)

      return request(app)
        .get(`/referral-details/${randomUUID()}/availability`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(referralDetails.crn)
          expect(res.text).toContain(referralDetails.personName)
          expect(res.text).toContain('availability')
        })
    })
  })
})
