import type { SystemToken } from '@hmpps-auth'
import type { HmppsAuthClient, RestClientBuilderWithoutToken } from '.'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'
import PersonalDetails from '../models/PersonalDetails'

export interface DummyData {
  message: string
}

export default class AccreditedProgrammesManageAndDeliverService {
  constructor(private readonly hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient>) {}

  createRestClient = (token: Express.User['token'] | SystemToken): RestClient =>
    new RestClient(
      'Accredited Programmes Manage And Deliver Service API Client',
      config.apis.accreditedProgrammesManageAndDeliverService as ApiConfig,
      token,
    )

  async getPersonalDetails(username: Express.User['username'], id: string): Promise<PersonalDetails> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)
    const restClient = this.createRestClient(systemToken)
    return (await restClient.get({
      path: `/referral/${id}`,
      headers: { Accept: 'application/json' },
    })) as PersonalDetails
  }

  async getDummy(username: Express.User['username']): Promise<DummyData> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)
    const restClient = this.createRestClient(systemToken)
    return (await restClient.get({
      path: `/hello-world`,
      headers: { Accept: 'application/json' },
    })) as DummyData
  }
}
