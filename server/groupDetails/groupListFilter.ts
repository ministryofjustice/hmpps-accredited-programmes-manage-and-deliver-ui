import { Request } from 'express'
import { GroupListFilterParams } from './groupListFilterParams'

export default class GroupListFilter {
  groupCode: string | undefined = undefined

  cohort: string | undefined = undefined

  pdu: string | undefined = undefined

  sex: string | undefined = undefined

  deliveryLocations: string[] | undefined = undefined

  static empty(): GroupListFilter {
    return new GroupListFilter()
  }

  static fromRequest(request: Request): GroupListFilter {
    const filter = new GroupListFilter()
    filter.cohort = request.query.cohort as string | undefined
    filter.groupCode = request.query.groupCode as string | undefined

    filter.pdu = request.query.pdu as string | undefined
    filter.sex = request.query.sex as string | undefined

    if (!filter?.pdu) {
      delete filter.deliveryLocations
    } else if (filter?.pdu.length) {
      const reportingTeams = request.query.deliveryLocations as string[] | undefined
      filter.deliveryLocations = typeof reportingTeams === 'string' ? [reportingTeams] : reportingTeams
    }

    return filter
  }

  get params(): GroupListFilterParams {
    const params: GroupListFilterParams = {}

    if (this.cohort) {
      params.cohort = this.cohort
    }

    if (this.groupCode?.trim()) {
      params.groupCode = this.groupCode.trim()
    }

    if (this.pdu) {
      params.pdu = this.pdu
    }

    if (this.deliveryLocations) {
      params.deliveryLocations = this.deliveryLocations
    }

    if (this.sex) {
      params.sex = this.sex
    }

    return params
  }

  get paramsAsQueryParams(): string {
    const searchParams = new URLSearchParams()
    Object.entries(this.params).forEach(([key, value]) => searchParams.append(key, value))
    return searchParams.toString()
  }
}
