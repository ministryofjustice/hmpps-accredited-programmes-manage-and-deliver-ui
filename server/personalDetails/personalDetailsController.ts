import { Request, Response } from 'express'

import PersonalDetailsPresenter from './personalDetailsPresenter'
import PersonalDetailsView from './personalDetailsView'
import ControllerUtils from '../utils/controllerUtils'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

export default class PersonalDetailsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showPersonalDetailsPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { id } = req.params
    // const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(username, id)
    const personalDetails = {
      crn: '1234',
      nomsNumber: 'CN1234',
      name: {
        forename: 'Steve',
        surname: 'Sticks',
      },
      dateOfBirth: 'Jan 01 1990',
      ethnicity: 'British',
      gender: 'Male',
      probationDeliveryUnit: {
        code: 'LDN',
        description: 'London',
      },
      setting: 'Community',
    }
    const presenter = new PersonalDetailsPresenter(personalDetails)
    const view = new PersonalDetailsView(presenter)

    ControllerUtils.renderWithLayout(res, view)
  }
}
