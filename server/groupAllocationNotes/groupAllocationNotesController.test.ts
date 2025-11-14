import { ReferralDetails } from '@manage-and-deliver-api'
import { randomUUID } from 'crypto'
import { Express } from 'express'
import request from 'supertest'
import { appWithAllRoutes } from '../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import ReferralMotivationBackgroundAndNonAssociationsFactory from '../testutils/factories/referralMotivationBackgroundAndNonAssociationsFactory'

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

describe('Group allocation notes', () => {
  describe('GET /referral/:referralId/group-allocation-notes/motivation-background-and-non-associations', () => {
    it('loads the motivation background and non associations page', async () => {
      const motivationBackgroundAndNonAssociations = ReferralMotivationBackgroundAndNonAssociationsFactory.build({
        id: null,
      })
      accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations.mockResolvedValue(
        motivationBackgroundAndNonAssociations,
      )

      return request(app)
        .get(`/referral/${randomUUID()}/group-allocation-notes/motivation-background-and-non-associations`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(`Group allocation notes`)
        })
    })
  })
})
