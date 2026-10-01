import { AuditServiceFactory } from '@ministryofjustice/hmpps-audit-client'
import sendAuditEvent from './auditService'
import logger from '../../logger'
import config from '../config'

jest.mock('@ministryofjustice/hmpps-audit-client')
jest.mock('../../logger')
jest.mock('../config')

const logAuditEvent = jest.fn()
;(AuditServiceFactory.createInstance as jest.Mock).mockReturnValue({ logAuditEvent })

describe('Audit service', () => {
  beforeEach(() => {
    logAuditEvent.mockReset()
    ;(logger.error as jest.Mock).mockClear()
  })

  describe('sendAuditEvent', () => {
    it('should skip sending audit event when audit is disabled', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = false

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123', 'subject123', 'CRN')

      expect(logAuditEvent).not.toHaveBeenCalled()
    })

    it('should send audit message when audit is enabled', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = true
      logAuditEvent.mockResolvedValue(undefined)

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123', 'subject123', 'CRN', {
        referralId: 'referralId',
        hasLdc: true,
      })

      expect(AuditServiceFactory.createInstance).toHaveBeenCalledWith(
        expect.objectContaining({ serviceName: 'hmpps-accredited-programmes-manage-and-deliver-ui' }),
        logger,
      )
      expect(logAuditEvent).toHaveBeenCalledWith({
        what: 'EDIT_REFERRAL_LDC',
        who: 'testuser123',
        subjectId: 'subject123',
        subjectType: 'CRN',
        details: { referralId: 'referralId', hasLdc: true },
      })
    })

    it('should use NOT_APPLICABLE as default subjectType', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = true
      logAuditEvent.mockResolvedValue(undefined)

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123')

      expect(logAuditEvent).toHaveBeenCalledWith({
        what: 'EDIT_REFERRAL_LDC',
        who: 'testuser123',
        subjectId: undefined,
        subjectType: 'NOT_APPLICABLE',
        details: undefined,
      })
    })

    it('should handle audit message send error', async () => {
      ;(config as jest.Mocked<typeof config>).sqs.audit.enabled = true
      const error = new Error('SQS connection failed')
      logAuditEvent.mockRejectedValue(error)

      await sendAuditEvent('EDIT_REFERRAL_LDC', 'testuser123')

      expect(logger.error).toHaveBeenCalledWith('Error sending audit event:', error)
    })
  })
})
