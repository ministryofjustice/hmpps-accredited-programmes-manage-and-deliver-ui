import { Request, Response } from 'express'
import ControllerUtils from '../../utils/controllerUtils'
import AddToGroupPresenter from './addToGroupPresenter'
import AddToGroupView from './addToGroupView'
import AddToGroupMoreDetailsPresenter from './addToGroupMoreDetailsPresenter'
import AddToGroupMoreDetailsView from './addToGroupMoreDetailsView'
import { FormValidationError } from '../../utils/formValidationError'
import AddToGroupForm from './addToGroupForm'

export default class AddToGroupController {
  constructor() {}

  async addToGroup(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null

    if (req.method === 'POST') {
      const data = await new AddToGroupForm(req).addToGroupData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate.addToGroup.toLowerCase() === 'yes') {
        return res.redirect(`/addToGroup/123/123/moreDetails`)
      } else {
        return res.redirect(`/groupDetails/1234/waitlist`)
      }
    }

    const presenter = new AddToGroupPresenter(formError)
    const view = new AddToGroupView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async addToGroupMoreDetails(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddToGroupForm(req).addToGroupMoreDetailsData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        return res.redirect(`/groupDetails/1234/allocated?addedToGroup=true`)
      }
    }

    const presenter = new AddToGroupMoreDetailsPresenter(formError, userInputData)
    const view = new AddToGroupMoreDetailsView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
