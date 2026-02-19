import { Request } from 'express'
import { GroupAllocationsFilterParams } from './groupAllocationsFilterParams'

export default class GroupAllocationsFilter {
  nameOrCRN: string | undefined = undefined

  cohort: string | undefined = undefined

  pdu: string | undefined = undefined

  sex: string | undefined = undefined

  reportingTeam: string[] | undefined = undefined

  static empty(): GroupAllocationsFilter {
    return new GroupAllocationsFilter()
  }

  static fromRequest(request: Request): GroupAllocationsFilter {
    const filter = new GroupAllocationsFilter()
    filter.cohort = request.query.cohort as string | undefined
    filter.nameOrCRN = request.query.nameOrCRN as string | undefined
    filter.reportingTeam = request.query.reportingTeam as string[] | undefined
    filter.pdu = request.query.pdu as string | undefined
    filter.sex = request.query.sex as string | undefined

    if (filter.reportingTeam !== undefined) {
      filter.reportingTeam = typeof filter.reportingTeam === 'string' ? [filter.reportingTeam] : filter.reportingTeam
    }
    return filter
  }

  get params(): GroupAllocationsFilterParams {
    const params: GroupAllocationsFilterParams = {}

    if (this.cohort) {
      params.cohort = this.cohort
    }

    if (this.nameOrCRN?.trim()) {
      params.nameOrCRN = this.nameOrCRN.trim()
    }

    if (this.pdu) {
      params.pdu = this.pdu
    }

    if (this.reportingTeam) {
      params.reportingTeam = this.reportingTeam
    }

    if (this.sex) {
      params.sex = this.sex
    }

    return params
  }
}
