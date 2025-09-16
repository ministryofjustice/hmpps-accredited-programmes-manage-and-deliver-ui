import { Request, Response } from 'express'

import { DeliveryLocationPreferencesFormData } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import LocationPreferencesPresenter from './locationPreferencesPresenter'
import LocationPreferencesView from './locationPreferencesView'
import { FormValidationError } from '../utils/formValidationError'
import AddLocationPreferenceForm from './addLocationPreferenceForm'
import AdditionalPdusPresenter from './additionalPdusPresenter'
import AdditionalPdusView from './additionalPdusView'
import CannotAttendLocationsPresenter from './cannotAttendLocationsPresenter'
import CannotAttendLocationsView from './cannotAttendLocationsView'

export default class LocationPreferencesController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showLocationPreferencesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const preferredLocationReferenceData =
      await this.accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral(
        username,
        referralId,
      )

    req.session.locationPreferenceFormData = {
      ...req.session.locationPreferenceFormData,
      preferredLocationReferenceData,
    }

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).data()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.locationPreferenceFormData.updatePreferredLocationData = {
          preferredDeliveryLocations: data.paramsForUpdate.locations,
          cannotAttendText: null,
        }
        if (data.paramsForUpdate.addOtherPduLocations.toLowerCase() === 'yes') {
          return res.redirect(`/referral/${referralId}/add-location-preferences/additional-pdus`)
        }
        return res.redirect(`/referral/${referralId}/add-location-preferences/cannot-attend-locations`)
      }
    }

    const presenter = new LocationPreferencesPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceData,
      formError,
      userInputData,
      req.session.locationPreferenceFormData.updatePreferredLocationData
    )

    const view = new LocationPreferencesView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }

  async showAdditionalPduLocationPreferencesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const preferredLocationReferenceData: DeliveryLocationPreferencesFormData =
      req.session.locationPreferenceFormData.preferredLocationReferenceData ??
      (await this.accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral(
        req.user.username,
        referralId,
      ))

    req.session.locationPreferenceFormData = {
      ...req.session.locationPreferenceFormData,
      preferredLocationReferenceData,
    }

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).additionalPdusData()

      req.session.locationPreferenceFormData.updatePreferredLocationData.preferredDeliveryLocations =
        req.session.locationPreferenceFormData.updatePreferredLocationData.preferredDeliveryLocations.concat(
          data.paramsForUpdate.otherPduLocations,
        )

      return res.redirect(`/referral/${referralId}/add-location-preferences/cannot-attend-locations`)
    }

    const presenter = new AdditionalPdusPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceData,
      req.session.locationPreferenceFormData.updatePreferredLocationData,
    )
    const view = new AdditionalPdusView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }

  async showCannotAttendLocationsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).cannotAttendLocationData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.locationPreferenceFormData.updatePreferredLocationData.cannotAttendText =
          data.paramsForUpdate.cannotAttendLocations
        if (req.session.locationPreferenceFormData.preferredLocationReferenceData.existingDeliveryLocationPreferences) {
          await this.accreditedProgrammesManageAndDeliverService.updateDeliveryLocationPreferences(
            username,
            referralId,
            req.session.locationPreferenceFormData.updatePreferredLocationData,
          )
        } else {
          await this.accreditedProgrammesManageAndDeliverService.createDeliveryLocationPreferences(
            username,
            referralId,
            req.session.locationPreferenceFormData.updatePreferredLocationData,
          )
        }

        req.session.locationPreferenceFormData = null
        return res.redirect(`/referral-details/${referralId}/location?preferredLocationUpdated=true#location`)
      }
    }
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      formError,
      userInputData,
      req.session.locationPreferenceFormData.preferredLocationReferenceData,
    )
    const view = new CannotAttendLocationsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}
