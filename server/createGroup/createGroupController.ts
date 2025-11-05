import { CreateGroup } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import CreateGroupCodePresenter from './createGroupCodePresenter'
import CreateGroupCodeView from './createGroupCodeView'
import CreateGroupCohortPresenter from './createGroupCohortPresenter'
import CreateGroupCohortView from './createGroupCohortView'
import CreateGroupCyaPresenter from './createGroupCyaPresenter'
import CreateGroupCyaView from './createGroupCyaView'
import CreateGroupForm from './createGroupForm'
import CreateGroupSexPresenter from './createGroupSexPresenter'
import CreateGroupSexView from './createGroupSexView'
import CreateGroupStartPresenter from './createGroupStartPresenter'
import CreateGroupStartView from './createGroupStartView'

export default class CreateGroupController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showCreateGroupStart(req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      return res.redirect('/group/create-a-group/code')
    }

    // Clear session data at start of journey
    req.session.createGroupFormData = {}

    const presenter = new CreateGroupStartPresenter()
    const view = new CreateGroupStartView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCode(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupCodeData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          groupCode: data.paramsForUpdate.groupCode,
        }
        return res.redirect(`/group/create-a-group/cohort`)
      }
    }

    const presenter = new CreateGroupCodePresenter(formError, createGroupFormData)
    const view = new CreateGroupCodeView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCohort(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupCohortData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          cohort: data.paramsForUpdate.cohort,
        }
        return res.redirect(`/group/create-a-group/sex`)
      }
    }

    const presenter = new CreateGroupCohortPresenter(formError, createGroupFormData)
    const view = new CreateGroupCohortView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupSex(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupSexData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          sex: data.paramsForUpdate.sex,
        }
        return res.redirect(`/group/create-a-group/check-your-answers`)
      }
    }

    const presenter = new CreateGroupSexPresenter(formError, createGroupFormData)
    const view = new CreateGroupSexView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCya(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    if (req.method === 'POST') {
      await this.accreditedProgrammesManageAndDeliverService.createGroup(username, createGroupFormData as CreateGroup)
      return res.redirect(`/?updated`)
    }

    const presenter = new CreateGroupCyaPresenter(createGroupFormData)
    const view = new CreateGroupCyaView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
