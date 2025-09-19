import express, { Express } from 'express'
import { NotFound } from 'http-errors'

import { randomUUID } from 'crypto'
import { Session, SessionData } from 'express-session'
import errorHandler from '../../errorHandler'
import { HmppsUser } from '../../interfaces/hmppsUser'
import setUpWebSession from '../../middleware/setUpWebSession'
import type { Services } from '../../services'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import AuditService from '../../services/auditService'
import nunjucksSetup from '../../utils/nunjucksSetup'
import routes from '../index'

jest.mock('../../services/auditService')

export const user: HmppsUser = {
  name: 'FIRST LAST',
  userId: 'id',
  token: 'token',
  username: 'user1',
  displayName: 'First Last',
  authSource: 'nomis',
  staffId: 1234,
  userRoles: [],
}

export const flashProvider = jest.fn()

function appSetup(
  services: Services,
  production: boolean,
  userSupplier: () => HmppsUser,
  sessionData: SessionData,
): Express {
  const app = express()

  app.set('view engine', 'njk')

  app.use((req, res, next) => {
    // req.user = userSupplier() as Express.User

    req.session = sessionData as Session & Partial<SessionData>

    next()
  })

  nunjucksSetup(app)
  app.use(setUpWebSession())
  app.use((req, res, next) => {
    req.user = userSupplier() as Express.User
    req.flash = flashProvider
    res.locals = {
      user: { ...req.user } as HmppsUser,
    }
    next()
  })
  app.use((req, res, next) => {
    req.id = randomUUID()
    next()
  })
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(routes(services))
  app.use((req, res, next) => next(new NotFound()))
  app.use(errorHandler(production))

  return app
}

export function appWithAllRoutes({
  production = false,
  services = {
    auditService: new AuditService(null) as jest.Mocked<AuditService>,
    accreditedProgrammesManageAndDeliverService: new AccreditedProgrammesManageAndDeliverService(
      null,
    ) as jest.Mocked<AccreditedProgrammesManageAndDeliverService>,
  },
  userSupplier = () => user,
  sessionData = {} as SessionData,
}: {
  production?: boolean
  services?: Partial<Services>
  userSupplier?: () => HmppsUser
  sessionData?: SessionData
}): Express {
  return appSetup(services as Services, production, userSupplier, sessionData)
}
