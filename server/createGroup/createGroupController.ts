import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import CreateGroupCodePresenter from './createGroupCodePresenter'
import CreateGroupCodeView from './createGroupCodeView'
import CreateGroupStartPresenter from './createGroupStartPresenter'
import CreateGroupStartView from './createGroupStartView'

export default class CreateGroupController {
  constructor() {}

  async showCreateGroupStart(req: Request, res: Response): Promise<void> {
    const formError: FormValidationError | null = null
    const userInputData = null
    if (req.method === 'POST') {
      return res.redirect('/group/create-a-group/cohort')
    }

    const presenter = new CreateGroupStartPresenter()
    const view = new CreateGroupStartView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCode(req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      return res.redirect('/group/create-a-group/code')
    }

    const presenter = new CreateGroupCodePresenter()
    const view = new CreateGroupCodeView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
