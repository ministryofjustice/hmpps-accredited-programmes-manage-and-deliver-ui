import {
  Contracts,
  defaultClient,
  DistributedTracingModes,
  getCorrelationContext,
  setup,
  type TelemetryClient,
} from 'applicationinsights'
import { RequestHandler } from 'express'
import type { ApplicationInfo } from '../applicationInfo'

export function initialiseAppInsights(): void {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function buildAppInsightsClient(
  { applicationName, buildNumber }: ApplicationInfo,
  overrideName?: string,
): TelemetryClient {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    defaultClient.context.tags['ai.cloud.role'] = overrideName || applicationName
    defaultClient.context.tags['ai.application.ver'] = buildNumber
    defaultClient.addTelemetryProcessor((envelope: Contracts.EnvelopeTelemetry, contextObjects) => {
      const isRequest = envelope?.data?.baseType === Contracts.TelemetryTypeString.Request
      const username = contextObjects?.['http.ServerRequest']?.res?.locals?.user?.username
      if (isRequest && username && envelope.data && envelope.data.baseData) {
        const props = envelope.data.baseData.properties || {}
        // eslint-disable-next-line no-param-reassign
        envelope.data.baseData.properties = { username, ...props }
      }
      const { tags, data } = envelope
      const operationNameOverride = contextObjects?.correlationContext?.customProperties?.getProperty?.('operationName')

      if (operationNameOverride) {
        tags['ai.operation.name'] = operationNameOverride
        data.baseData.name = operationNameOverride
      }
      return true
    })
    return defaultClient
  }
  return null
}

export function appInsightsMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.prependOnceListener('finish', () => {
      const context = getCorrelationContext()
      if (context && req.route) {
        const path = req.route?.path
        const pathToReport = Array.isArray(path) ? `"${path.join('" | "')}"` : path
        context.customProperties.setProperty('operationName', `${req.method} ${pathToReport}`)
      }
    })
    next()
  }
}
