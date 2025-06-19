import type { SystemToken } from '@hmpps-auth'
import type { HmppsAuthClient, RestClientBuilderWithoutToken } from '.'
import RestClient from './restClient'
import config, { ApiConfig } from '../config'

export default class AccreditedProgrammesManageAndDeliverService {
  constructor(private readonly hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient>) {}

  createRestClient = (token: Express.User['token'] | SystemToken): RestClient =>
    new RestClient(
      'Accredited Programmes Manage And Deliver Service API Client',
      config.apis.accreditedProgrammesManageAndDeliverService as ApiConfig,
      token,
    )

  async getDummy(username: Express.User['username']): Promise<string> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)
    const restClient = this.createRestClient(systemToken)
    return (await restClient.get({
      path: `/hello-world`,
      headers: { Accept: 'application/json' },
    })) as string
  }
}
