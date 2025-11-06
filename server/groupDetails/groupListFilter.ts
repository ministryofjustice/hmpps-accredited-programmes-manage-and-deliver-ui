import { Request } from 'express'
import { GroupListFilterParams } from './groupListFilterParams'

export default class GroupListFilter {
  status: string | undefined

  cohort: string | undefined

  nameOrCRN: string | undefined

  pdu: string | undefined

  sex: string | undefined

  reportingTeam: string[] | undefined

  static fromRequest(request: Request): GroupListFilter {
    const filter = new GroupListFilter()
    filter.status = request.query.status as string | undefined
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

  get params(): GroupListFilterParams {
    const params: GroupListFilterParams = {}

    if (this.status) {
      params.status = this.status
    }
    if (this.cohort) {
      params.cohort = this.cohort
    }
    if (this.nameOrCRN?.trim()) {
      params.nameOrCRN = this.nameOrCRN.trim()
    }

    if (this.pdu) {
      params.pdu = this.pdu
    }

    if (this.sex) {
      params.sex = this.sex
    }

    if (this.reportingTeam) {
      params.reportingTeam = this.reportingTeam
    }

    return params
  }
}
