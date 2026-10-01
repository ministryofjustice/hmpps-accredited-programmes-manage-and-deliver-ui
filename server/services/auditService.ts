import { AuditService, AuditServiceFactory, SubjectType } from '@ministryofjustice/hmpps-audit-client'
import logger from '../../logger'
import config from '../config'

type AuditSubjectType = SubjectType | 'GROUP'

let auditService: AuditService<string, AuditSubjectType> | undefined

const getAuditService = (): AuditService<string, AuditSubjectType> => {
  if (!auditService) {
    auditService = AuditServiceFactory.createInstance<string, AuditSubjectType>(
      {
        ...config.sqs.audit,
        serviceName: 'hmpps-accredited-programmes-manage-and-deliver-ui',
      },
      logger,
    )
  }
  return auditService
}

export default async function sendAuditEvent(
  action: string,
  username: string,
  subjectId?: string,
  subjectType?: AuditSubjectType,
  details?: Record<string, unknown>,
) {
  // Check if audit is enabled for environment
  if (!config.sqs.audit.enabled) {
    logger.debug('Audit not enabled, skipping sending audit event')
    return
  }

  try {
    await getAuditService().logAuditEvent({
      what: action,
      who: username,
      subjectId,
      subjectType: subjectType || 'NOT_APPLICABLE',
      details,
    })
    logger.info('Audit event sent successfully')
  } catch (error) {
    logger.error('Error sending audit event:', error)
  }
}
