import { Request } from 'express'
import { CaselistFilterParams } from './CaseListFilterParams'

export default class CaselistFilter {
  status?: string

  cohort?: string

  crnOrPersonName?: string

  flag?: string

  static fromRequest(request: Request): CaselistFilter {
    const filter = new CaselistFilter()
    if (request.query.status) {
      filter.status = request.query.status as string
    }

    if (request.query.cohort) {
      filter.cohort = request.query.cohort as string
    }

    if (request.query.crnOrPersonName) {
      filter.crnOrPersonName = request.query.crnOrPersonName as string
    }

    // filter.status = if(!!request.query.status) request.query.status as string | undefined
    // filter.cohort = request.query.cohort as string | undefined
    // filter.crnOrPersonName = request.query.crnOrPersonName as string | undefined
    console.log('--------------- request')
    console.log(request)
    console.log('--------------- request')

    console.log('--------------- filter')
    console.log(filter)
    console.log('--------------- filter')

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

    return params
  }
}
