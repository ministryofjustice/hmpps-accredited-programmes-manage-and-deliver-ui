import { auditService } from '@ministryofjustice/hmpps-audit-client'
import config from '../config'
import logger from '../../logger'

export default async function sendAuditEvent(
  action: string,
  username: string,
  subjectId?: string,
  subjectType?: string,
  details?: object,
) {
  // Check if audit is enabled for environment
  if (!config.sqs.audit.enabled) {
    logger.debug('Audit not enabled, skipping sending audit event')
    return
  }

  try {
    await auditService.sendAuditMessage({
      action,
      who: username,
      subjectId,
      subjectType: subjectType || 'NOT_APPLICABLE',
      service: 'hmpps-accredited-programmes-manage-and-deliver-ui',
      details: details ? JSON.stringify(details) : undefined,
    })
    logger.info('Audit event sent successfully')
  } catch (error) {
    logger.error('Error sending audit event:', error)
  }
}
