import express from 'express'

import createError from 'http-errors'

import {
  CreateDeliveryLocationPreferences,
  CreateGroupRequest,
  DeliveryLocationPreferencesFormData,
  EditSessionFacilitatorsRequest,
  RescheduleSessionRequest,
  ScheduleSessionRequest,
  SessionAttendance,
} from '@manage-and-deliver-api'
import { setupExpressErrorHandler } from '@sentry/node'
import errorHandler from './errorHandler'
import authorisationMiddleware from './middleware/authorisationMiddleware'
import { appInsightsMiddleware } from './utils/azureAppInsights'
import nunjucksSetup from './utils/nunjucksSetup'

import setUpAuthentication from './middleware/setUpAuthentication'
import setUpCsrf from './middleware/setUpCsrf'
import setUpCurrentUser from './middleware/setUpCurrentUser'
import setUpHealthChecks from './middleware/setUpHealthChecks'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'

import config from './config'
import sentryMiddleware from './middleware/sentryMiddleware'
import routes from './routes'
import type { Services } from './services'

declare module 'express-session' {
  export interface SessionData {
    originPage: string
    locationPreferenceFormData?: {
      updatePreferredLocationData?: CreateDeliveryLocationPreferences
      preferredLocationReferenceData?: DeliveryLocationPreferencesFormData
      hasUpdatedAdditionalLocationData?: boolean
    }
    groupManagementData?: {
      groupCode?: string
      personName?: string
      removeFromGroup?: boolean
    }
    createGroupFormData?: Partial<CreateGroupRequest>
    sessionScheduleData?: Partial<ScheduleSessionRequest> & {
      headingText?: string
      sessionName?: string
      referralName?: string
      selectedSession?: string
    }
    editSessionDateAndTime?: Partial<RescheduleSessionRequest>
    sessionFacilitators?: Partial<EditSessionFacilitatorsRequest[]>
    editSessionAttendance?: Partial<SessionAttendance> & { referralIds?: string[] }
  }
}

export default function createApp(services: Services): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(sentryMiddleware())
  app.use(appInsightsMiddleware())
  app.use(setUpHealthChecks(services.applicationInfo))
  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpAuthentication())
  app.use(authorisationMiddleware(config.allowedRoles))
  app.use(setUpCsrf())
  app.use(setUpCurrentUser())

  app.use(routes(services))

  if (config.sentry.dsn) setupExpressErrorHandler(app)
  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}
