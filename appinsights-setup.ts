import * as appInsights from 'applicationinsights'

// Setup Application Insights if connection string or instrumentation key is present
const connectionString = process.env.APPINSIGHTS_CONNECTION_STRING || process.env.APPINSIGHTS_INSTRUMENTATIONKEY
if (connectionString) {
  appInsights
    .setup(connectionString)
    .setAutoCollectConsole(true, true)
    .setAutoCollectRequests(true)
    .setAutoCollectPerformance(true, true)
    .start()
}
