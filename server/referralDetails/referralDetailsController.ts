import { Request, Response } from 'express'

import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import AddAvailabilityForm from './addAvailability/AddAvailabilityForm'
import AddAvailabilityPresenter from './addAvailability/addAvailabilityPresenter'
import AddAvailabilityView from './addAvailability/addAvailabilityView'
import AdditionalInformationPresenter from './additionalInformationPresenter'
import AdditionalInformationView from './additionalInformationView'
import AvailabilityPresenter from './availabilityPresenter'
import AvailabilityView from './availabilityView'
import LocationPresenter from './locationPresenter'
import LocationView from './locationView'
import OffenceHistoryPresenter from './offenceHistoryPresenter'
import OffenceHistoryView from './offenceHistoryView'
import PersonalDetailsPresenter from './personalDetailsPresenter'
import PersonalDetailsView from './personalDetailsView'
import ProgrammeHistoryPresenter from './programmeHistoryPresenter'
import ProgrammeHistoryView from './programmeHistoryView'
import SentenceInformationPresenter from './sentenceInformationPresenter'
import SentenceInformationView from './sentenceInformationView'
import StatusHistoryPresenter from './statusHistoryPresenter'
import StatusHistoryView from './statusHistoryView'

export default class ReferralDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showReferralDetailsPage(id: string, username: string): Promise<ReferralDetails> {
    return this.accreditedProgrammesManageAndDeliverService.getReferralDetails(id, username)
  }

  async showPersonalDetailsPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { isCohortUpdated, isLdcUpdated } = req.query
    const { username } = req.user
    const subNavValue = 'personalDetails'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(id, username)

    const presenter = new PersonalDetailsPresenter(
      sharedReferralDetailsData,
      subNavValue,
      personalDetails,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new PersonalDetailsView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showProgrammeHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'programmeHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new ProgrammeHistoryPresenter(
      sharedReferralDetailsData,
      subNavValue,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new ProgrammeHistoryView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showOffenceHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'offenceHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const offenceHistory = await this.accreditedProgrammesManageAndDeliverService.getOffenceHistory(username, id)

    const presenter = new OffenceHistoryPresenter(
      sharedReferralDetailsData,
      subNavValue,
      offenceHistory,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new OffenceHistoryView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showSentenceInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'sentenceInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const sentenceInformation = await this.accreditedProgrammesManageAndDeliverService.getSentenceInformation(
      username,
      id,
    )

    const presenter = new SentenceInformationPresenter(
      sharedReferralDetailsData,
      subNavValue,
      sentenceInformation,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new SentenceInformationView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated, detailsUpdated } = req.query
    const subNavValue = 'availability'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const availability = await this.accreditedProgrammesManageAndDeliverService.getAvailability(username, id)

    const presenter = new AvailabilityPresenter(
      sharedReferralDetailsData,
      subNavValue,
      availability,
      detailsUpdated === 'true',
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AvailabilityView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showLocationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated, preferredLocationUpdated } = req.query
    const subNavValue = 'location'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const deliveryLocationPreferences =
      await this.accreditedProgrammesManageAndDeliverService.getDeliveryLocationPreferences(username, id)

    const presenter = new LocationPresenter(
      sharedReferralDetailsData,
      subNavValue,
      deliveryLocationPreferences,
      preferredLocationUpdated === 'true',
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new LocationView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAdditionalInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'additionalInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new AdditionalInformationPresenter(
      sharedReferralDetailsData,
      subNavValue,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AdditionalInformationView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showStatusHistoryPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { message, isCohortUpdated, isLdcUpdated } = req.query

    const sharedReferralDetailsData = await this.showReferralDetailsPage(referralId, username)
    const statusHistory = await this.accreditedProgrammesManageAndDeliverService.getStatusHistory(username, referralId)

    const successMessage = message ? String(message) : null

    const presenter = new StatusHistoryPresenter(
      referralId,
      statusHistory,
      sharedReferralDetailsData,
      successMessage,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new StatusHistoryView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async updateAvailability(req: Request, res: Response): Promise<void> {
    const { availabilityId } = req.params
    await this.showAddAvailabilityPage(req, res, availabilityId)
  }

  async showAddAvailabilityPage(req: Request, res: Response, availabilityId: string = null): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const sharedReferralDetailsData = await this.showReferralDetailsPage(referralId, username)

    let formError: FormValidationError | null = null
    let userInputData = null
    if (req.method === 'POST') {
      const data = await new AddAvailabilityForm(req, referralId).data()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        if (availabilityId) {
          await this.accreditedProgrammesManageAndDeliverService.updateAvailability(username, {
            ...data.paramsForUpdate,
            availabilityId,
          })
        } else {
          await this.accreditedProgrammesManageAndDeliverService.addAvailability(username, data.paramsForUpdate)
        }
        return res.redirect(`/referral-details/${referralId}/availability?detailsUpdated=true`)
      }
    }

    const availability = await this.accreditedProgrammesManageAndDeliverService.getAvailability(username, referralId)

    const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(
      referralId,
      username,
    )

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      req.session.originPage,
      availability,
      formError,
      userInputData,
      referralId,
    )
    const view = new AddAvailabilityView(presenter)

    return ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }
}
