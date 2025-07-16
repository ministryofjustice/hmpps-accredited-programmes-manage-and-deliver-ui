import { Request, Response } from 'express'

import ReferralDetailsPresenter from './referralDetailsPresenter'
import ReferralDetailsView from './referralDetailsView'
import ControllerUtils from '../utils/controllerUtils'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import AddAvailabilityPresenter from './addAvailability/addAvailabilityPresenter'
import AddAvailabilityView from './addAvailability/addAvailabilityView'

export default class ReferralDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showReferralDetailsPage(req: Request, res: Response): Promise<void> {
    const splitUrl = req.originalUrl.split('?section=')
    let subNavValue = splitUrl[1]
    if (subNavValue === undefined) {
      subNavValue = 'personalDetails'
    }
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
    const presenter = new ReferralDetailsPresenter(personalDetails, subNavValue, id)
    const view = new ReferralDetailsView(presenter)

    ControllerUtils.renderWithLayout(res, view, personalDetails)
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
