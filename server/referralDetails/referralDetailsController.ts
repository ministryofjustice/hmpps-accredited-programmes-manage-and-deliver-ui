import { Request, Response } from 'express'

import ReferralDetailsView from './referralDetailsView'
import ControllerUtils from '../utils/controllerUtils'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import AddAvailabilityPresenter from './addAvailability/addAvailabilityPresenter'
import AddAvailabilityView from './addAvailability/addAvailabilityView'
import PersonalDetails from '../models/PersonalDetails'
import AvailabilityPresenter from './availabilityPresenter'
import AvailabilityView from './availabilityView'
import PersonalDetailsPresenter from './personalDetailsPresenter'
import PersonalDetailsView from './personalDetailsView'
import ProgrammeHistoryPresenter from './programmeHistoryPresenter'
import ProgrammeHistoryView from './programmeHistoryView'
import SentenceInformationPresenter from './sentenceInformationPresenter'
import SentenceInformationView from './sentenceInformationView'
import LocationPresenter from './locationPresenter'
import LocationView from './locationView'
import AdditionalInformationPresenter from './additionalInformationPresenter'
import AdditionalInformationView from './additionalInformationView'

export default class ReferralDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showReferralDetailsPage(req: Request, res: Response) {
    // const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(username, id)
    const personalDetails = {
      crn: '1234',
      nomsNumber: 'CN1234',
      name: {
        forename: 'Steve',
        surname: 'Sticks',
      },
      dateOfBirth: '1980-01-01',
      ethnicity: 'British',
      gender: 'Male',
      probationDeliveryUnit: {
        code: 'LDN',
        description: 'London',
      },
      setting: 'Community',
    }

    return {
      personalDetails,
    }
  }

  async showPersonalDetailsPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'personalDetails'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new PersonalDetailsPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new PersonalDetailsView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showProgrammeHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'programmeHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new ProgrammeHistoryPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new ProgrammeHistoryView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showOffenceHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'offenceHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new ProgrammeHistoryPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new ProgrammeHistoryView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showSentenceInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'sentenceInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new SentenceInformationPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new SentenceInformationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'availability'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new AvailabilityPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new AvailabilityView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showLocationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'location'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new LocationPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new LocationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showAdditionalInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'additionalInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(req, res)

    const presenter = new AdditionalInformationPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new AdditionalInformationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showAddAvailabilityPage(req: Request, res: Response): Promise<void> {
    // const { username } = req.user
    const { id } = req.params
    // const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(username, id)
    const personalDetails = {
      crn: '1234',
      nomsNumber: 'CN1234',
      name: {
        forename: 'Steve',
        surname: 'Sticks',
      },
      dateOfBirth: '1980-01-01',
      ethnicity: 'British',
      gender: 'Male',
      probationDeliveryUnit: {
        code: 'LDN',
        description: 'London',
      },
      setting: 'Community',
    }

    const presenter = new AddAvailabilityPresenter()
    const view = new AddAvailabilityView(presenter)

    ControllerUtils.renderWithLayout(res, view, personalDetails)
  }
}
