import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import BaseController from '../../shared/baseController'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import { FormValidationError } from '../../utils/formValidationError'
import CreateOrEditGroupForm from '../createOrEditGroupForm'
import CreateOrEditGroupSexPresenter from './createOrEditGroupSexPresenter'
import CreateOrEditGroupSexView from './createOrEditGroupSexView'

export default class EditGroupSexController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showEditGroupSex(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const bffEditGroupSexData = await this.accreditedProgrammesManageAndDeliverService.getBffEditGroupSex(
      username,
      groupId,
    )
    const selectedSex = bffEditGroupSexData.radios.find(
      (radio: { selected: boolean; value: string }) => radio.selected,
    )?.value

    const createGroupFormData = {
      sex: selectedSex || groupDetails?.sex,
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req, '').createGroupSexData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          sex: data.paramsForUpdate.sex,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details`)
      }
    }

    const presenter = new CreateOrEditGroupSexPresenter(
      formError,
      createGroupFormData,
      userInputData,
      groupId,
      groupDetails?.code,
    )
    const view = new CreateOrEditGroupSexView(presenter)
    return this.renderPage(res, view)
  }
}
