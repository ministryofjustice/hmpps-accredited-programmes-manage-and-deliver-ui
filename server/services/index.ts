import { dataAccess, hmppsAuthClientBuilder } from '../data'
import AuditService from './auditService'
import AccreditedProgrammesManageAndDeliverService from './accreditedProgrammesManageAndDeliverService'

export const services = () => {
  const { applicationInfo, hmppsAuditClient } = dataAccess()

  const auditService = new AuditService(hmppsAuditClient)
  const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
    hmppsAuthClientBuilder,
  )

  return {
    applicationInfo,
    auditService,
    accreditedProgrammesManageAndDeliverService,
  }
}

export type Services = ReturnType<typeof services>
