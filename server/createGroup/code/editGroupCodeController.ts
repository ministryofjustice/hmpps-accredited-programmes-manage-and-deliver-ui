import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import BaseController from '../../shared/baseController'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import { FormValidationError } from '../../utils/formValidationError'
import CreateOrEditGroupForm from '../createOrEditGroupForm'
import CreateOrEditGroupCodePresenter from './createOrEditGroupCodePresenter'
import CreateOrEditGroupCodeView from './createOrEditGroupCodeView'

export default class EditGroupCodeController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showEditGroupCode(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const createGroupFormData = {
      groupCode: groupDetails?.code,
    }

    if (req.method === 'POST') {
      let existingGroup = { code: '' }

      if (req.body['create-group-code']) {
        const matchingGroup = await this.accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion(
          username,
          req.body['create-group-code'],
        )

        existingGroup = matchingGroup?.id === groupId ? { code: '' } : { code: matchingGroup?.code || '' }
      }

      const data = await new CreateOrEditGroupForm(req, existingGroup.code).createGroupCodeData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          groupCode: data.paramsForUpdate.groupCode,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details`)
      }
    }

    const presenter = new CreateOrEditGroupCodePresenter(
      formError,
      createGroupFormData,
      userInputData,
      groupId,
      createGroupFormData.groupCode,
    )
    const view = new CreateOrEditGroupCodeView(presenter)
    return this.renderPage(res, view)
  }
}
