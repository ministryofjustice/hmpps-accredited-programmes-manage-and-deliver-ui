import { Request } from 'express'
import { CaselistFilterParams } from './CaseListFilterParams'

export default class CaselistFilter {
  status: string | undefined

  cohort: string | undefined

  crnOrPersonName: string | undefined

  pdu: string | undefined

  reportingTeam: string[] | undefined

  static fromRequest(request: Request, locations: { pdu: string; locations: string[] }[]): CaselistFilter {
    const filter = new CaselistFilter()
    filter.status = request.query.status as string | undefined
    filter.cohort = request.query.cohort as string | undefined
    filter.crnOrPersonName = request.query.crnOrPersonName as string | undefined
    filter.reportingTeam = request.query.reportingTeam as string[] | undefined
    filter.pdu = request.query.pdu as string | undefined

    if (filter.reportingTeam !== undefined) {
      filter.reportingTeam = typeof filter.reportingTeam === 'string' ? [filter.reportingTeam] : filter.reportingTeam

      // Validate that reporting teams belong to the selected PDU. If not, remove the reporting team filter.
      if (filter.pdu) {
        const selectedPdu = locations.find(locationPdu => locationPdu.pdu === filter.pdu)
        const allTeamsValid = filter.reportingTeam.every(team => selectedPdu.locations.includes(team))

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
