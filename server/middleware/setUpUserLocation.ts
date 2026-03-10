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
        next()
        return
      }

      // Fetch location for user's region
      const username = res.locals.user?.username
      if (!username) {
        next()
        return
      }

      const locations = await services.accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion(username)

      // Get the first location (primary location for the user's region)
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
