import { Request, Response } from 'express'

import { DeliveryLocationPreferencesFormData } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import LocationPreferencesPresenter from './locationPreferencesPresenter'
import LocationPreferencesView from './locationPreferencesView'
import { FormValidationError } from '../../utils/formValidationError'
import AddLocationPreferenceForm from './addLocationPreferenceForm'
import AdditionalPdusPresenter from './additionalPdusPresenter'
import AdditionalPdusView from './additionalPdusView'
import CannotAttendLocationsPresenter from './cannotAttendLocationsPresenter'
import CannotAttendLocationsView from './cannotAttendLocationsView'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import BaseController from '../../shared/baseController'
import sendAuditEvent from '../../services/auditService'

export default class LocationPreferencesController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showLocationPreferencesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params as Record<string, string>
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_ADD_LOCATION_PREFERENCES', username, referralDetails?.crn ?? referralId, 'CRN', {
        referralId,
      })
    }

    const preferredLocationReferenceData =
      await this.accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral(
        username,
        referralId,
      )

    const locationPreferenceFormData = this.getLocationPreferenceFormData(req, referralId)

    this.setLocationPreferenceFormData(req, referralId, {
      ...locationPreferenceFormData,
      preferredLocationReferenceData,
    })

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).primaryPduData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const updatedLocationPreferenceFormData = this.getLocationPreferenceFormData(req, referralId)

        this.setLocationPreferenceFormData(req, referralId, {
          ...updatedLocationPreferenceFormData,
          updatePreferredLocationData: {
            preferredDeliveryLocations: data.paramsForUpdate.locations,
            cannotAttendText: null,
          },
        })
        if (data.paramsForUpdate.addOtherPduLocations.toLowerCase() === 'yes') {
          return res.redirect(`/referral/${referralId}/add-location-preferences/other-pdu`)
        }
        req.session.originPage = req.originalUrl
        return res.redirect(`/referral/${referralId}/add-locations-cannot-attend`)
      }
    }

    const presenter = new LocationPreferencesPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceData,
      this.getLocationPreferenceFormData(req, referralId)?.updatePreferredLocationData,
      formError,
      userInputData,
    )

    const view = new LocationPreferencesView(presenter)
    return this.renderPage(res, view, referralDetails)
  }

  async showAdditionalPduLocationPreferencesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params as Record<string, string>
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    if (req.method === 'GET') {
      await sendAuditEvent(
        'VIEW_ADDITIONAL_PDU_LOCATION_PREFERENCES',
        username,
        referralDetails?.crn ?? referralId,
        'CRN',
        {
          referralId,
        },
      )
    }

    const locationPreferenceFormData = this.getLocationPreferenceFormData(req, referralId)

    const preferredLocationReferenceData: DeliveryLocationPreferencesFormData =
      locationPreferenceFormData?.preferredLocationReferenceData ??
      (await this.accreditedProgrammesManageAndDeliverService.getPossibleDeliveryLocationsForReferral(
        req.user.username,
        referralId,
      ))

    this.setLocationPreferenceFormData(req, referralId, {
      ...locationPreferenceFormData,
      preferredLocationReferenceData,
    })

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).additionalPdusData()

      const currentLocationPreferenceFormData = this.getLocationPreferenceFormData(req, referralId)

      if (!currentLocationPreferenceFormData?.updatePreferredLocationData) {
        return res.redirect(`/referral/${referralId}/add-location-preferences`)
      }

      // We clear all additional offices out of the session apart from those in the primary pdu.
      // This is required to avoid duplication when adding the offices submitted in the form if you have returned to the
      // page via the back button.
      const preferredDeliveryLocations =
        currentLocationPreferenceFormData.updatePreferredLocationData.preferredDeliveryLocations
          .filter(
            location =>
              location.pduCode === currentLocationPreferenceFormData.preferredLocationReferenceData.primaryPdu.code,
          )
          .concat(data.paramsForUpdate.otherPduLocations)

      this.setLocationPreferenceFormData(req, referralId, {
        ...currentLocationPreferenceFormData,
        updatePreferredLocationData: {
          ...currentLocationPreferenceFormData.updatePreferredLocationData,
          preferredDeliveryLocations,
        },
        hasUpdatedAdditionalLocationData: true,
      })

      req.session.originPage = req.originalUrl
      return res.redirect(`/referral/${referralId}/add-locations-cannot-attend`)
    }

    const updatedLocationPreferenceFormData = this.getLocationPreferenceFormData(req, referralId)

    const presenter = new AdditionalPdusPresenter(
      referralId,
      referralDetails,
      preferredLocationReferenceData,
      updatedLocationPreferenceFormData?.updatePreferredLocationData,
      updatedLocationPreferenceFormData?.hasUpdatedAdditionalLocationData,
    )
    const view = new AdditionalPdusView(presenter)
    return this.renderPage(res, view, referralDetails)
  }

  async showCannotAttendLocationsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params as Record<string, string>
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const locationPreferenceFormData = this.getLocationPreferenceFormData(req, referralId)

    if (
      !locationPreferenceFormData?.preferredLocationReferenceData ||
      !locationPreferenceFormData.updatePreferredLocationData
    ) {
      return res.redirect(`/referral/${referralId}/add-location-preferences`)
    }

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddLocationPreferenceForm(req, referralId).cannotAttendLocationData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const updatePreferredLocationData = {
          ...locationPreferenceFormData.updatePreferredLocationData,
          cannotAttendText: data.paramsForUpdate.cannotAttendLocations,
        }

        this.setLocationPreferenceFormData(req, referralId, {
          ...locationPreferenceFormData,
          updatePreferredLocationData,
        })

        await sendAuditEvent(
          'UPDATE_REFERRAL_LOCATION_PREFERENCES',
          username,
          referralDetails?.crn ?? referralId,
          'CRN',
          {
            referralId,
            details: JSON.stringify(updatePreferredLocationData),
          },
        )
        // Post if no existing preference data
        if (locationPreferenceFormData.preferredLocationReferenceData.existingDeliveryLocationPreferences) {
          await this.accreditedProgrammesManageAndDeliverService.updateDeliveryLocationPreferences(
            username,
            referralId,
            updatePreferredLocationData,
          )
        } else {
          // Put if existing preference data.
          await this.accreditedProgrammesManageAndDeliverService.createDeliveryLocationPreferences(
            username,
            referralId,
            updatePreferredLocationData,
          )
        }
        // Clear scoped session state at end of journey
        this.clearLocationPreferenceFormData(req, referralId)
        return res.redirect(
          `/referral/${referralId}/availability-and-motivation/location?preferredLocationUpdated=true#location`,
        )
      }
    }

    await sendAuditEvent('VIEW_CANNOT_ATTEND_LOCATIONS', username, referralDetails?.crn ?? referralId, 'CRN', {
      referralId,
    })

    const presenter = new CannotAttendLocationsPresenter(
      referralId,
      referralDetails,
      locationPreferenceFormData.preferredLocationReferenceData,
      req.session.originPage,
      formError,
      userInputData,
    )

    const view = new CannotAttendLocationsView(presenter)
    return this.renderPage(res, view, referralDetails)
  }

  private getLocationPreferenceFormData(req: Request, referralId: string) {
    const scopedData =
      req.session.locationPreferenceFormDataByReferral?.[referralId] ?? req.session.locationPreferenceFormData

    req.session.locationPreferenceFormData = scopedData

    return scopedData
  }

  private setLocationPreferenceFormData(
    req: Request,
    referralId: string,
    data: Request['session']['locationPreferenceFormData'],
  ) {
    req.session.locationPreferenceFormDataByReferral = {
      ...(req.session.locationPreferenceFormDataByReferral ?? {}),
      [referralId]: data,
    }

    req.session.locationPreferenceFormData = data
  }

  private clearLocationPreferenceFormData(req: Request, referralId: string): void {
    if (req.session.locationPreferenceFormDataByReferral) {
      delete req.session.locationPreferenceFormDataByReferral[referralId]
    }

    req.session.locationPreferenceFormData = null
  }
}
