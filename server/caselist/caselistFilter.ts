import { Request } from 'express'
import { CaselistFilterParams } from './CaseListFilterParams'

export default class CaselistFilter {
  status: string | undefined

  cohort: string | undefined

  crnOrPersonName: string | undefined

  static fromRequest(request: Request): CaselistFilter {
    const filter = new CaselistFilter()
    filter.status = request.query.status as string | undefined
    filter.cohort = request.query.cohort as string | undefined
    filter.crnOrPersonName = request.query.crnOrPersonName as string | undefined
    return filter
  }

  get params(): CaselistFilterParams {
    const params: CaselistFilterParams = {}

    if (this.status !== undefined) {
      params.status = this.status
    }
    if (this.cohort !== undefined) {
      params.cohort = this.cohort
    }
    if (this.crnOrPersonName !== undefined) {
      params.crnOrPersonName = this.crnOrPersonName.trim()
    }

    return params
  }
}
