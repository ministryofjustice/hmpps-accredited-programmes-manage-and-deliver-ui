import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import CreateGroupCodePresenter from './createGroupCodePresenter'
import CreateGroupCodeView from './createGroupCodeView'
import CreateGroupCohortPresenter from './createGroupCohortPresenter'
import CreateGroupCohortView from './createGroupCohortView'
import CreateGroupForm from './createGroupForm'
import CreateGroupSexPresenter from './createGroupSexPresenter'
import CreateGroupSexView from './createGroupSexView'
import CreateGroupStartPresenter from './createGroupStartPresenter'
import CreateGroupStartView from './createGroupStartView'

export default class CreateGroupController {
  constructor() {}

  async showCreateGroupStart(req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      return res.redirect('/group/create-a-group/code')
    }

    // Clear session data at start of journey
    req.session.createGroupFormData = null

    const presenter = new CreateGroupStartPresenter()
    const view = new CreateGroupStartView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCode(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupCodeData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...req.session.createGroupFormData,
          groupCode: data.paramsForUpdate.groupCode,
        }
        return res.redirect(`/group/create-a-group/cohort`)
      }
    }

    const presenter = new CreateGroupCodePresenter(formError)
    const view = new CreateGroupCodeView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCohort(req: Request, res: Response): Promise<void> {
    const { groupCode = 'test' } = req.session.createGroupFormData || undefined
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupCohortData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...req.session.createGroupFormData,
          cohort: data.paramsForUpdate.cohort,
        }
        return res.redirect(`/group/create-a-group/sex`)
      }
    }

    const presenter = new CreateGroupCohortPresenter(formError, groupCode)
    const view = new CreateGroupCohortView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupSex(req: Request, res: Response): Promise<void> {
    const { groupCode = 'test' } = req.session.createGroupFormData || undefined
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupSexData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...req.session.createGroupFormData,
          sex: data.paramsForUpdate.sex,
        }
        return res.redirect(`/group/create-a-group/check-your-answers`)
      }
    }

    const presenter = new CreateGroupSexPresenter(formError, groupCode)
    const view = new CreateGroupSexView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
