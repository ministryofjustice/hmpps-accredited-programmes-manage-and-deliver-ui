import { AuthenticatedRequest, VerificationClient } from '@ministryofjustice/hmpps-auth-clients'
import { setUser } from '@sentry/node'
import flash from 'connect-flash'
import { Router } from 'express'
import passport from 'passport'
import { Strategy } from 'passport-oauth2'
import logger from '../../logger'
import config from '../config'
import { HmppsUser } from '../interfaces/hmppsUser'
import generateOauthClientToken from '../utils/clientCredentials'
import hashUsername from '../utils/sentryUser'

passport.serializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user)
})

passport.deserializeUser((user, done) => {
  // Not used but required for Passport
  done(null, user as Express.User)
})

passport.use(
  new Strategy(
    {
      authorizationURL: `${config.apis.hmppsAuth.externalUrl}/oauth/authorize`,
      tokenURL: `${config.apis.hmppsAuth.url}/oauth/token`,
      clientID: config.apis.hmppsAuth.authClientId,
      clientSecret: config.apis.hmppsAuth.authClientSecret,
      callbackURL: `${config.ingressUrl}/sign-in/callback`,
      state: true,
      customHeaders: { Authorization: generateOauthClientToken() },
    },
    (token, refreshToken, params, profile, done) => {
      return done(null, { token, username: params.user_name, authSource: params.auth_source })
    },
  ),
)

export const validatePath = (value: string) => (value.startsWith('/') && !value.startsWith('//') ? value : '')

export const buildSignOutRedirectUri = (ingressUrl: string, returnTo: string) => {
  const safeReturnTo = validatePath(returnTo)
  return safeReturnTo ? `${ingressUrl}?returnTo=${encodeURIComponent(safeReturnTo)}` : ingressUrl
}

export default function setupAuthentication() {
  const router = Router()
  const tokenVerificationClient = new VerificationClient(config.apis.tokenVerification, logger)

  router.use(passport.initialize())
  router.use(passport.session())
  router.use(flash())

  router.get('/autherror', (req, res) => {
    res.status(401)
    return res.render('autherror')
  })

  router.get('/sign-in', (req, res, next) => {
    const requestedReturnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : ''
    const safeReturnTo = validatePath(requestedReturnTo)

    if (safeReturnTo) {
      req.session.returnTo = safeReturnTo
    }

    return passport.authenticate('oauth2')(req, res, next)
  })

  router.get('/sign-in/callback', (req, res, next) => {
    const returnTo = req.session.returnTo || '/'
    delete req.session.returnTo

    return passport.authenticate('oauth2', {
      successRedirect: returnTo,
      failureRedirect: '/autherror',
    })(req, res, next)
  })

  const authUrl = config.apis.hmppsAuth.externalUrl

  router.use('/sign-out', (req, res, next) => {
    const requestedReturnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : ''
    const redirectUri = buildSignOutRedirectUri(config.ingressUrl, requestedReturnTo)
    const signOutParams = new URLSearchParams({
      client_id: config.apis.hmppsAuth.authClientId,
      redirect_uri: redirectUri,
    })
    const authSignOutUrl = `${authUrl}/sign-out?${signOutParams.toString()}`

    if (req.user) {
      req.logout(err => {
        if (err) return next(err)
        return req.session.destroy(() => res.redirect(authSignOutUrl))
      })
    } else res.redirect(authSignOutUrl)
  })

  router.use('/account-details', (req, res) => {
    const authParameters = `client_id=${config.apis.hmppsAuth.authClientId}&redirect_uri=${config.ingressUrl}`
    res.redirect(`${authUrl}/account-details?${authParameters}`)
  })

  router.use(async (req, res, next) => {
    if (req.isAuthenticated() && (await tokenVerificationClient.verifyToken(req as unknown as AuthenticatedRequest))) {
      const sentryUserId = hashUsername(req.user.username)
      setUser({ id: sentryUserId })
      res.locals.sentryUserId = sentryUserId
      return next()
    }
    const requestedReturnTo = typeof req.query.returnTo === 'string' ? req.query.returnTo : ''
    const safeReturnTo = validatePath(requestedReturnTo)

    req.session.returnTo = safeReturnTo || req.originalUrl
    return res.redirect('/sign-in')
  })

  router.use((req, res, next) => {
    res.locals.user = req.user as HmppsUser
    next()
  })

  return router
}
