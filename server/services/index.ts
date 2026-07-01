import { dataAccess, hmppsAuthClientBuilder } from '../data'
import AccreditedProgrammesManageAndDeliverService from './accreditedProgrammesManageAndDeliverService'

export const services = () => {
  const { applicationInfo } = dataAccess()

  const accreditedProgrammesManageAndDeliverService = new AccreditedProgrammesManageAndDeliverService(
    hmppsAuthClientBuilder,
  )

  return {
    applicationInfo,
    accreditedProgrammesManageAndDeliverService,
  }
}

export type Services = ReturnType<typeof services>
