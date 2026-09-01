import { Express } from 'express'
import jwt from 'jsonwebtoken'
import request from 'supertest'
import { user } from '../../routes/testutils/appSetup'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../../services/auditService'
import forceStatusFormDataFactory from '../../testutils/factories/forceStatusFormDataFactory'
import statusHistoryFactory from '../../testutils/factories/statusHistoryFactory'
import TestUtils from '../../testutils/testUtils'

jest.mock('../../services/accreditedProgrammesManageAndDeliverService')
jest.mock('../../data/hmppsAuthClient')
jest.mock('../../services/auditService')

const hmppsAuthClientBuilder = jest.fn()
const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
  hmppsAuthClientBuilder,
) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>

const ADMIN_WRITE_ROLE = 'ROLE_ACCREDITED_PROGRAMMES_MANAGE_AND_DELIVER_API__ADMIN_WR'

function tokenWithAuthorities(authorities: string[]) {
  return jwt.sign(
    {
      user_name: 'user1',
      scope: ['read', 'write'],
      auth_source: 'nomis',
      authorities,
      jti: 'a610a10-cca6-41db-985f-e87efb303aaf',
      client_id: 'clientid',
    },
    'secret',
    { expiresIn: '1h' },
  )
}

const adminUserSupplier = () => ({ ...user, token: tokenWithAuthorities([ADMIN_WRITE_ROLE]) })
const nonAdminUserSupplier = () => ({ ...user, token: tokenWithAuthorities([]) })

let app: Express

const formData = forceStatusFormDataFactory.build()

afterEach(() => {
  jest.resetAllMocks()
})

describe('Force Status Controller', () => {
  describe('GET /admin/force-status', () => {
    it('loads the referral lookup page for a user with the admin role', async () => {
      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService }, adminUserSupplier)

      return request(app)
        .get('/admin/force-status')
        .expect(200)
        .expect(res => {
          expect(res.text).toContain('Force-update referral status')
          expect(res.text).toContain('Referral ID')
        })
    })

    it('redirects to /authError for a user without the admin role', async () => {
      app = TestUtils.createTestAppWithSession(
        {},
        { accreditedProgrammesManageAndDeliverService },
        nonAdminUserSupplier,
      )

      return request(app).get('/admin/force-status').expect(302).expect('Location', '/authError')
    })
  })

  describe('POST /admin/force-status', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService }, adminUserSupplier)
    })

    it('redirects to the force-status page for the entered referral ID', async () => {
      return request(app)
        .post('/admin/force-status')
        .type('form')
        .send({ 'referral-id': formData.referralId })
        .expect(302)
        .expect('Location', `/admin/force-status/${formData.referralId}`)
    })

    it('re-renders with a validation error when the referral ID is not a UUID', async () => {
      return request(app)
        .post('/admin/force-status')
        .type('form')
        .send({ 'referral-id': 'not-a-uuid' })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Enter a referral ID in the correct format')
        })
    })
  })

  describe('GET /admin/force-status/:referralId', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService }, adminUserSupplier)
      accreditedProgrammesManageAndDeliverService.getForceStatusFormData.mockResolvedValue(formData)
    })

    it('shows the CRN, current status and available statuses for the referral', async () => {
      return request(app)
        .get(`/admin/force-status/${formData.referralId}`)
        .expect(200)
        .expect(res => {
          expect(res.text).toContain(formData.crn)
          expect(res.text).toContain(formData.currentStatus.status)
          formData.availableStatuses.forEach(status => {
            expect(res.text).toContain(status.status)
          })
        })
    })

    it('redirects to /authError for a user without the admin role', async () => {
      app = TestUtils.createTestAppWithSession(
        {},
        { accreditedProgrammesManageAndDeliverService },
        nonAdminUserSupplier,
      )

      return request(app).get(`/admin/force-status/${formData.referralId}`).expect(302).expect('Location', '/authError')
    })
  })

  describe('POST /admin/force-status/:referralId', () => {
    beforeEach(() => {
      app = TestUtils.createTestAppWithSession({}, { accreditedProgrammesManageAndDeliverService }, adminUserSupplier)
      accreditedProgrammesManageAndDeliverService.getForceStatusFormData.mockResolvedValue(formData)
    })

    it('force-updates the status and redirects with a success message', async () => {
      const newStatusId = formData.availableStatuses[1].id
      accreditedProgrammesManageAndDeliverService.forceUpdateStatus.mockResolvedValue({
        referralStatusHistory: statusHistoryFactory.build({ referralStatusDescriptionId: newStatusId }),
        message: "This person's referral status is now Awaiting allocation.",
      })

      const response = await request(app)
        .post(`/admin/force-status/${formData.referralId}`)
        .type('form')
        .send({ 'new-status': newStatusId, 'more-details': 'Correcting drift from nDelius' })
        .expect(302)

      expect(response.headers.location).toContain(`/admin/force-status/${formData.referralId}?message=`)
      expect(accreditedProgrammesManageAndDeliverService.forceUpdateStatus).toHaveBeenCalledWith(
        'user1',
        formData.referralId,
        {
          referralStatusDescriptionId: newStatusId,
          additionalDetails: 'Correcting drift from nDelius',
        },
      )
      expect(sendAuditEvent).toHaveBeenCalledWith('ADMIN_FORCE_UPDATE_REFERRAL_STATUS', 'user1', formData.crn, 'CRN', {
        referralId: formData.referralId,
        updatedStatusId: newStatusId,
      })
    })

    it('re-renders with a validation error when no status is selected', async () => {
      return request(app)
        .post(`/admin/force-status/${formData.referralId}`)
        .type('form')
        .send({ 'more-details': '' })
        .expect(400)
        .expect(res => {
          expect(res.text).toContain('Select the new referral status')
        })
    })
  })
})
