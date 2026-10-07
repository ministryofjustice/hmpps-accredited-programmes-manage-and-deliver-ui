import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import applicationInfoSupplier from '../applicationInfo'
import config from '../config'
import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'

import logger from '../../logger'

const applicationInfo = applicationInfoSupplier()

type RestClientBuilder<T> = (token: Express.User['token']) => T
type RestClientBuilderWithoutToken<T> = () => T

const tokenStore = new InMemoryTokenStore()

const hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient> = () => new HmppsAuthClient(tokenStore)

export const dataAccess = () => {
  const hmppsAuthClient = new AuthenticationClient(
    config.apis.hmppsAuth,
    logger,
    config.redis.enabled ? new RedisTokenStore(createRedisClient()) : new InMemoryTokenStore(),
  )

  return {
    applicationInfo,
    hmppsAuthClient,
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuthClient, hmppsAuthClientBuilder }
export type { RestClientBuilder, RestClientBuilderWithoutToken }
