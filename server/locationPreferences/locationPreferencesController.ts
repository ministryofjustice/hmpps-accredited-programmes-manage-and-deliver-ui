import { Request, Response } from 'express'

import { CreateDeliveryLocationPreferences, DeliveryLocationPreferencesFormData } from '@manage-and-deliver-api'
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

    const possibleDeliveryLocations =
      await this.accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral(
        username,
        referralId,
      )

    req.session.locationPreferenceFormData = {
      ...req.session.locationPreferenceFormData,
      referenceData: possibleDeliveryLocations,
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
        req.session.locationPreferenceFormData = data.paramsForUpdate
        if (data.paramsForUpdate.addOtherPduLocations.toLowerCase() === 'yes') {
          return res.redirect(`/referral/${referralId}/add-location-preferences/additional-pdus`)
        }
        req.session.locationPreferenceFormData.otherPduLocations = []
        return res.redirect(`/referral/${referralId}/add-location-preferences/cannot-attend-locations`)
      }
    }

    const presenter = new LocationPreferencesPresenter(
      referralId,
      referralDetails,
      possibleDeliveryLocations,
      req.originalUrl,
      formError,
      userInputData,
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

    const referenceData: DeliveryLocationPreferencesFormData =
      req.session.locationPreferenceFormData.referenceData ??
      (await this.accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral(
        req.user.username,
        referralId,
      ))

    req.session.locationPreferenceFormData = { ...req.session.locationPreferenceFormData, referenceData }

    const currentFormData = req.session.locationPreferenceFormData

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).additionalPdusData()

      req.session.locationPreferenceFormData.otherPduLocations = data.paramsForUpdate.otherPduLocations
      return res.redirect(`/referral/${referralId}/add-location-preferences/cannot-attend-locations`)
    }
    const presenter = new AdditionalPdusPresenter(referralId, referralDetails, currentFormData)
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

    const currentFormData = req.session.locationPreferenceFormData
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).cannotAttendLocationData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.locationPreferenceFormData.cannotAttendLocations = data.paramsForUpdate.cannotAttendLocations

        let createDeliveryLocationPreferences: CreateDeliveryLocationPreferences = {
          preferredDeliveryLocations: [
            {
              pduCode: req.session.locationPreferenceFormData.referenceData.primaryPdu.code,
              pduDescription: req.session.locationPreferenceFormData.referenceData.primaryPdu.name,
              deliveryLocations: req.session.locationPreferenceFormData.referenceData.primaryPdu.deliveryLocations
                .filter(it => data.paramsForUpdate.locations.includes(it.label))
                .map(location => ({ code: location.value, description: location.label })),
            },
          ],
          cannotAttendText: req.session.locationPreferenceFormData.cannotAttendLocations,
        }


        const otherPdus = req.session.locationPreferenceFormData.referenceData.otherPdusInSameRegion
          .flatMap(pdu => pdu.deliveryLocations)
          .filter(location => data.paramsForUpdate.otherPduLocations.includes(location.label))
            .map(location => ({ code: location.value, description: location.label }))

          createDeliveryLocationPreferences.preferredDeliveryLocations = createDeliveryLocationPreferences.preferredDeliveryLocations.push(otherPdus)

        const locationPreferences =
          await this.accreditedProgrammesManageAndDeliverService.createDeliveryLocationPreferences(
            username,
            referralId,
            createDeliveryLocationPreferences,
          )
      }
    }
    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      currentFormData,
      formError,
      userInputData,
    )
    const view = new CannotAttendLocationsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}
