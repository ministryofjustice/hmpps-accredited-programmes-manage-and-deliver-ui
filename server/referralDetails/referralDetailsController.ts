import { Request, Response } from 'express'

import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
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

export default class ReferralDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showReferralDetailsPage(id: string, username: string): Promise<ReferralDetails> {
    return this.accreditedProgrammesManageAndDeliverService.getReferralDetails(id, username)
  }

  async showPersonalDetailsPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'personalDetails'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(id, username)

    const presenter = new PersonalDetailsPresenter(sharedReferralDetailsData, subNavValue, id, personalDetails)
    const view = new PersonalDetailsView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showProgrammeHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'programmeHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new ProgrammeHistoryPresenter(sharedReferralDetailsData, subNavValue, id)
    const view = new ProgrammeHistoryView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showOffenceHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'offenceHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new OffenceHistoryPresenter(sharedReferralDetailsData, subNavValue, id)
    const view = new OffenceHistoryView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showSentenceInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'sentenceInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new SentenceInformationPresenter(sharedReferralDetailsData, subNavValue, id)
    const view = new SentenceInformationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'availability'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new AvailabilityPresenter(sharedReferralDetailsData, subNavValue, id)
    const view = new AvailabilityView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showLocationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'location'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new LocationPresenter(sharedReferralDetailsData, subNavValue, id)
    const view = new LocationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAdditionalInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'additionalInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new AdditionalInformationPresenter(sharedReferralDetailsData, subNavValue, id)
    const view = new AdditionalInformationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAddAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { id } = req.params
    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    // const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(username, id)

    const presenter = new AddAvailabilityPresenter(personalDetails)
    const view = new AddAvailabilityView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }
}
