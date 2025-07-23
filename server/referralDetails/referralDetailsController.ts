import { Request, Response } from 'express'

import ControllerUtils from '../utils/controllerUtils'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import AddAvailabilityPresenter from './addAvailability/addAvailabilityPresenter'
import AddAvailabilityView from './addAvailability/addAvailabilityView'
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
import OffenceHistoryPresenter from './offenceHistoryPresenter'
import OffenceHistoryView from './offenceHistoryView'
import PersonalDetails from '../models/PersonalDetails'
import AddAvailabilityForm from './addAvailability/AddAvailabilityForm'
import { FormValidationError } from '../utils/formValidationError'
import AddAvailabilityDatesPresenter from './addAvailabilityDates/addAvailabilityDatesPresenter'
import AddAvailabilityDatesView from './addAvailabilityDates/addAvailabilityDatesView'
import AddAvailabilityDatesForm from './addAvailabilityDates/addAvailabilityDatesForm'

export default class ReferralDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showReferralDetailsPage() {
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

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const presenter = new PersonalDetailsPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new PersonalDetailsView(presenter)

    req.session.originPage = req.originalUrl

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showProgrammeHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'programmeHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const presenter = new ProgrammeHistoryPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new ProgrammeHistoryView(presenter)

    req.session.originPage = req.originalUrl

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showOffenceHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'offenceHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const presenter = new OffenceHistoryPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new OffenceHistoryView(presenter)

    req.session.originPage = req.originalUrl

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showSentenceInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'sentenceInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const presenter = new SentenceInformationPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new SentenceInformationView(presenter)

    req.session.originPage = req.originalUrl

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const subNavValue = 'availability'

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const availability = await this.accreditedProgrammesManageAndDeliverService.getAvailability(
      username,
      '6885d1f6-5958-40e0-9448-1ff8cc37e64',
    )

    const presenter = new AvailabilityPresenter(
      sharedReferralDetailsData.personalDetails,
      subNavValue,
      id,
      availability,
    )
    const view = new AvailabilityView(presenter)

    req.session.originPage = req.originalUrl

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showLocationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'location'

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const presenter = new LocationPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new LocationView(presenter)

    req.session.originPage = req.originalUrl

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showAdditionalInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const subNavValue = 'additionalInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage()

    const presenter = new AdditionalInformationPresenter(sharedReferralDetailsData.personalDetails, subNavValue, id)
    const view = new AdditionalInformationView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData.personalDetails)
  }

  async showAddAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    let formError: FormValidationError | null = null
    let userInputData = null
    if (req.method === 'POST') {
      const data = await new AddAvailabilityForm(req).data()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        return res.redirect(`/add-availability-dates/${id}`)
      }
    }
    const { username } = req.user
    const availability = await this.accreditedProgrammesManageAndDeliverService.getAvailability(
      username,
      '6885d1f6-5958-40e0-9448-1ff8cc37e64',
    )
    const personalDetails: PersonalDetails = {
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

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      formError,
      userInputData,
      req.session.originPage,
      availability,
    )
    const view = new AddAvailabilityView(presenter)

    return ControllerUtils.renderWithLayout(res, view, personalDetails)
  }

  async showAddAvailabilityDatesPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    let formError: FormValidationError | null = null
    let userInputData = null
    if (req.method === 'POST') {
      const data = await new AddAvailabilityDatesForm(req).data()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        // res.redirect(`/add-availability-dates/${id}`)
      }
    }
    const personalDetails: PersonalDetails = {
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

    const presenter = new AddAvailabilityDatesPresenter(personalDetails, formError, userInputData)
    const view = new AddAvailabilityDatesView(presenter, id)

    return ControllerUtils.renderWithLayout(res, view, personalDetails)
  }
}
