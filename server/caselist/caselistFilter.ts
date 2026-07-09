import { Request } from 'express'
import { LocationFilterValues } from '@manage-and-deliver-api'
import { CaselistFilterParams } from './CaseListFilterParams'

export default class CaselistFilter {
  status: string | undefined

  cohort: string | undefined

  crnOrPersonName: string | undefined

  pdu: string[] | undefined

  reportingTeam: string[] | undefined

  static fromRequest(request: Request, locations?: LocationFilterValues[]): CaselistFilter {
    const filter = new CaselistFilter()
    filter.status = request.query.status as string | undefined
    filter.cohort = request.query.cohort as string | undefined
    filter.crnOrPersonName = request.query.crnOrPersonName as string | undefined
    filter.pdu = request.query.pdu as string[] | undefined
    filter.reportingTeam = request.query.reportingTeam as string[] | undefined

    if (filter.pdu !== undefined) {
      filter.pdu = typeof filter.pdu === 'string' ? [filter.pdu] : filter.pdu
    }

    if (filter.reportingTeam !== undefined) {
      filter.reportingTeam = typeof filter.reportingTeam === 'string' ? [filter.reportingTeam] : filter.reportingTeam

      // Validate that reporting teams belong to the selected PDU. If not, remove the reporting team filter.
      if (filter.pdu && filter.pdu.length > 0 && locations && locations.length > 0) {
        const selectedPdus = locations.filter(locationPdu => filter.pdu!.includes(locationPdu.pduName))
        const allTeamsValid =
          selectedPdus.length > 0 &&
          filter.reportingTeam.every(team => selectedPdus.some(pdu => pdu.reportingTeams.includes(team)))

        if (!allTeamsValid) {
          filter.reportingTeam = undefined
        }
      }
    }
    return filter
  }

  get params(): CaselistFilterParams {
    const params: CaselistFilterParams = {}

    if (this.status) {
      params.status = this.status
    }
    if (this.cohort) {
      params.cohort = this.cohort
    }
    if (this.crnOrPersonName?.trim()) {
      params.crnOrPersonName = this.crnOrPersonName.trim()
    }

    if (this.pdu) {
      params.pdu = this.pdu
    }

    if (this.reportingTeam) {
      params.reportingTeam = this.reportingTeam
    }

    return params
  }
}
