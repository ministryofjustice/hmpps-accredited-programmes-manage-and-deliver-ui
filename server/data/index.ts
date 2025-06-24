/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { AuthenticationClient, InMemoryTokenStore, RedisTokenStore } from '@ministryofjustice/hmpps-auth-clients'
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'
import applicationInfoSupplier from '../applicationInfo'

const applicationInfo = applicationInfoSupplier()
initialiseAppInsights()
buildAppInsightsClient(applicationInfo)

import config from '../config'
import HmppsAuditClient from './hmppsAuditClient'
import HmppsAuthClient from './hmppsAuthClient'
import { createRedisClient } from './redisClient'

import logger from '../../logger'

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
    hmppsAuditClient: new HmppsAuditClient(config.sqs.audit),
  }
}

export type DataAccess = ReturnType<typeof dataAccess>

export { HmppsAuditClient, HmppsAuthClient, hmppsAuthClientBuilder }
export type { RestClientBuilder, RestClientBuilderWithoutToken }
