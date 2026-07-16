import * as Sentry from '@sentry/node'
import { name as applicationName } from '../package.json'
import config from './config'

if (config.sentry.dsn) {
  Sentry.init({
    dsn: config.sentry.dsn,
    integrations: [Sentry.httpIntegration(), Sentry.expressIntegration()],
    environment: config.sentry.environment,
    release: `${applicationName}@${config.gitRef}`,
    tracesSampler: samplingContext => {
      if (
        samplingContext.name.includes('ping') ||
        samplingContext.name.includes('health') ||
        samplingContext.name.includes('assets')
      ) {
        return 0
      }
      return config.sentry.tracesSampleRate
    },
    beforeSend(event) {
      if (event.user?.username) {
        // eslint-disable-next-line no-param-reassign
        delete event.user.username
      }
      return event
    },
  })
}
