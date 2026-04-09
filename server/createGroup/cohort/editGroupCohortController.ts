import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import BaseController from '../../shared/baseController'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import { FormValidationError } from '../../utils/formValidationError'
import CreateOrEditGroupForm from '../createOrEditGroupForm'
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
    const bffEditGroupCohortData = await this.accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort(
      username,
      groupId,
    )
    const selectedCohort = bffEditGroupCohortData.radios.find(
      (radio: { selected: boolean; value: string }) => radio.selected,
    )?.value

    const createGroupFormData = {
      cohort: selectedCohort || groupDetails?.cohort,
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req, '').createGroupCohortData()

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
