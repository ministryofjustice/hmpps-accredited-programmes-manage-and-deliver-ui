import { Request } from 'express'
import { CaselistFilterParams } from './CaseListFilterParams'

export default class CaselistFilter {
  referralStatus: string | undefined

  cohort: string | undefined

  nameOrCrn: string | undefined

  static fromRequest(request: Request): CaselistFilter {
    const filter = new CaselistFilter()
    filter.referralStatus = request.query.referralStatus as string | undefined
    filter.cohort = request.query.cohort as string | undefined
    filter.nameOrCrn = request.query.nameOrCrn as string | undefined
    return filter
  }

  get params(): CaselistFilterParams {
    const params: CaselistFilterParams = {}

    if (this.referralStatus !== undefined) {
      params.referralStatus = this.referralStatus
    }
    if (this.cohort !== undefined) {
      params.cohort = this.cohort
    }
    if (this.nameOrCrn !== undefined) {
      params.nameOrCrn = this.nameOrCrn.trim()
    }

    return params
  }
}
