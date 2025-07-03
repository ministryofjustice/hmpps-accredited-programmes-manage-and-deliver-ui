import type { SystemToken } from '@hmpps-auth'
import type { HmppsAuthClient, RestClientBuilderWithoutToken } from '../data'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'
import Caselist from '../models/caseList'

export interface DummyData {
  message: string
}

export interface PaginationParams {
  // Page number to retrieve -- starts from 1
  page?: number
  // Number of elements in a page
  size?: number
  // Sort by property, defaults to ascending order. If descending is required then add ',DESC' at the end of the property you want sorted i.e. ['$PROPERTY_NAME,DESC']
  sort?: string[]
}

export interface CaselistFilterParams {
  nameOrCrn?: string
  referralStatus?: string
  cohort?: string
}

export default class AccreditedProgrammesManageAndDeliverService {
  constructor(private readonly hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient>) {}

  createRestClient = (token: Express.User['token'] | SystemToken): RestClient =>
    new RestClient(
      'Accredited Programmes Manage And Deliver Service API Client',
      config.apis.accreditedProgrammesManageAndDeliverService as ApiConfig,
      token,
    )

  async getDummy(username: Express.User['username']): Promise<DummyData> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)
    const restClient = this.createRestClient(systemToken)
    return (await restClient.get({
      path: `/hello-world`,
      headers: { Accept: 'application/json' },
    })) as DummyData
  }

  async getOpenCaselist(username: Express.User['username']): Promise<Caselist> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)
    const restClient = this.createRestClient(systemToken)
    return (await restClient.get({
      path: `/pages/caselist/open`,
      headers: { Accept: 'application/json' },
    })) as Caselist
  }

  async getClosedCaselist(username: Express.User['username']): Promise<Caselist> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)
    const restClient = this.createRestClient(systemToken)
    return (await restClient.get({
      path: `/pages/caselist/closed`,
      headers: { Accept: 'application/json' },
    })) as Caselist
  }
}
