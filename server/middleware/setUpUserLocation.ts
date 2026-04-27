import express from 'express'
import type { Services } from '../services'
import logger from '../../logger'

export default function setUpUserLocation(services: Services) {
  const router = express.Router()

  router.use(async (req, res, next) => {
    try {
      // Check if location is already cached in session
      if (req.session.userLocation) {
        res.locals.userLocation = req.session.userLocation
        // Temporary logs while we debug a preprod issue --TJWC 2026-04-22
        logger.info(`[setUpUserLocation] req.session.userLocation is present, going to next()`)
        logger.info({ userLocation: req.session.userLocation })
        next()
        return
      }

      // Fetch location for user's region
      const username = res.locals.user?.username
      if (!username) {
        // Temporary logs while we debug a preprod issue --TJWC 2026-04-22
        logger.info(`[setUpUserLocation] No username in locals.user`)
        logger.info({ user: res.locals.user })
        next()
        return
      }

      const locations = await services.accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion(username)

      if (locations && locations.length > 0) {
        const primaryLocation = locations[0]
        const userLocation = {
          locationCode: primaryLocation.code,
          locationDescription: primaryLocation.description,
        }

        // Store in session for entire session duration
        req.session.userLocation = userLocation

        // Make available to all views
        res.locals.userLocation = userLocation
      }

      next()
    } catch (error) {
      logger.error(error, 'Error fetching user location')
      // Continue without location if API call fails
      next()
    }
  })

  return router
}
