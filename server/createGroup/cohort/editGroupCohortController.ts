import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import BaseController from '../../shared/baseController'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import { FormValidationError } from '../../utils/formValidationError'
import CreateGroupForm from '../createGroupForm'
import CreateOrEditGroupCohortPresenter from './createOrEditGroupCohortPresenter'
import CreateOrEditGroupCohortView from './createOrEditGroupCohortView'

export default class EditGroupCohortController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showEditGroupCohort(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const createGroupFormData = {
      cohort: groupDetails?.cohort,
    }

    if (req.method === 'POST') {
      let existingGroup = { cohort: '' }

      if (req.body['create-group-cohort']) {
        const matchingGroup = await this.accreditedProgrammesManageAndDeliverService.getGroupByCohortInRegion(
          username,
          req.body['create-group-cohort'],
        )

        existingGroup = matchingGroup?.id === groupId ? { cohort: '' } : { cohort: matchingGroup?.cohort || '' }
      }

      const data = await new CreateGroupForm(req, existingGroup.cohort).createGroupCohortData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          cohort: data.paramsForUpdate.cohort,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details`)
      }
    }

    const presenter = new CreateOrEditGroupCohortPresenter(
      formError,
      createGroupFormData,
      userInputData,
      groupId,
      groupDetails?.code,
    )
    const view = new CreateOrEditGroupCohortView(presenter)
    return this.renderPage(res, view)
  }
}
