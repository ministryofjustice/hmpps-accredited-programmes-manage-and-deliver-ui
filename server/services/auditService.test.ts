import { auditService } from '@ministryofjustice/hmpps-audit-client'
import sendAuditEvent from './auditService'
import logger from '../../logger'
import config from '../config'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../logger')
jest.mock('../config')

describe('Audit service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendAuditEvent', () => {
    it('should skip sending audit event when audit is disabled', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = false

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123', 'subject123', 'CRN')

      expect(auditService.sendAuditMessage).not.toHaveBeenCalled()
    })

    it('should send audit message when audit is enabled', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = true
      ;(auditService.sendAuditMessage as jest.Mock).mockResolvedValue(undefined)

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123', 'subject123', 'CRN', {
        referralId: 'referralId',
        hasLdc: true,
      })

      expect(auditService.sendAuditMessage).toHaveBeenCalledWith({
        action: 'EDIT_REFERRAL_LDC',
        who: 'testuser123',
        subjectId: 'subject123',
        subjectType: 'CRN',
        service: 'hmpps-accredited-programmes-manage-and-deliver-ui',
        details: JSON.stringify({ referralId: 'referralId', hasLdc: true }),
      })
    })

    it('should use NOT_APPLICABLE as default subjectType', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = true
      ;(auditService.sendAuditMessage as jest.Mock).mockResolvedValue(undefined)

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123')

      expect(auditService.sendAuditMessage).toHaveBeenCalledWith({
        action: 'EDIT_REFERRAL_LDC',
        who: 'testuser123',
        subjectId: undefined,
        subjectType: 'NOT_APPLICABLE',
        service: 'hmpps-accredited-programmes-manage-and-deliver-ui',
        details: undefined,
      })
    })

    it('should handle audit message send error', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = true
      const error = new Error('SQS connection failed')
      ;(auditService.sendAuditMessage as jest.Mock).mockRejectedValue(error)

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123')

      expect(logger.error).toHaveBeenCalledWith('Error sending audit event:', error)
    })
  })
})
