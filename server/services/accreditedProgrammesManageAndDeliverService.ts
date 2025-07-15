import type { HmppsAuthClient, RestClientBuilderWithoutToken } from '../data'
import RestClient from '../data/restClient'
import config, { ApiConfig } from '../config'
import Caselist from '../models/caseList'
import PersonalDetails from '../models/PersonalDetails'

export interface PaginationParams {
  // Page number to retrieve -- starts from 1
  page?: number
  // Number of elements in a page
  size?: number
  // Sort by property, defaults to ascending order. If descending is required then add ',DESC' at the end of the property you want sorted i.e. ['$PROPERTY_NAME,DESC']
  sort?: string[]
}

export default class AccreditedProgrammesManageAndDeliverService {
  constructor(private readonly hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient>) {}

  async createRestClientFromUsername(username: Express.User['username']): Promise<RestClient> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)

    return new RestClient(
      'Accredited Programmes Manage And Deliver Service API Client',
      config.apis.accreditedProgrammesManageAndDeliverService as ApiConfig,
      systemToken,
    )
  }

  async getOpenCaselist(username: Express.User['username']): Promise<Caselist> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/pages/caselist/open`,
      headers: { Accept: 'application/json' },
    })) as Caselist
  }

  async getClosedCaselist(username: Express.User['username']): Promise<Caselist> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/pages/caselist/closed`,
      headers: { Accept: 'application/json' },
    })) as Caselist
  }

  async getPersonalDetails(username: Express.User['username'], id: string): Promise<PersonalDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral/${id}`,
      headers: { Accept: 'application/json' },
    })) as PersonalDetails
  }
}
