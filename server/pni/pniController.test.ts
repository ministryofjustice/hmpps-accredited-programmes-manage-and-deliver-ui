import { Express } from 'express'
import request from 'supertest'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'
import TestUtils from '../testutils/testUtils'
import referralDetailsFactory from '../testutils/factories/referralDetailsFactory'
import pniScoreFactory from '../testutils/factories/pniScoreFactory'

jest.mock('../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../services/auditService')

const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  jest.fn(),
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

let app: Express

beforeEach(() => {
  app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService })
})

afterEach(() => {
  jest.resetAllMocks()
})

describe('PNI controller', () => {
  it('loads the PNI page and emits VIEW_PNI audit', async () => {
    const referralDetails = referralDetailsFactory.build()
    const pniScore = pniScoreFactory.build()
    const referralId = 'ABC123'

    accreditedProgrammesManageAndDeliverService.getReferralDetails.mockResolvedValueOnce(referralDetails)
    accreditedProgrammesManageAndDeliverService.getPniScore.mockResolvedValueOnce(pniScore)

    await request(app)
      .get(`/referral/${referralId}/programme-needs-identifier`)
      .expect(200)

    expect(sendAuditEvent).toHaveBeenCalledWith(
      'VIEW_PNI',
      'user1',
      referralDetails.crn,
      'CRN',
      expect.objectContaining({ referralId: expect.any(String) }),
    )
  })
})
