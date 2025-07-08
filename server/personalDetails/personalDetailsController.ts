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
    const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(username, id)
    const presenter = new PersonalDetailsPresenter(personalDetails)
    const view = new PersonalDetailsView(presenter)

    ControllerUtils.renderWithLayout(res, view)
  }
}
