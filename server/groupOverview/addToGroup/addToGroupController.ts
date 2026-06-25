import { Request, Response } from 'express'
import AddToGroupPresenter from './addToGroupPresenter'
import AddToGroupView from './addToGroupView'
import AddToGroupMoreDetailsPresenter from './addToGroupMoreDetailsPresenter'
import AddToGroupMoreDetailsView from './addToGroupMoreDetailsView'
import { FormValidationError } from '../../utils/formValidationError'
import AddToGroupForm from './addToGroupForm'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import BaseController from '../../shared/baseController'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import logger from '../../../logger'

export default class AddToGroupController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async addToGroup(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    const { groupId, referralId } = req.params as Record<string, string>

    if (req.method === 'POST') {
      const data = await new AddToGroupForm(req).addToGroupData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else if (data.paramsForUpdate.addToGroup.toLowerCase() === 'yes') {
        return res.redirect(`/${groupId}/${referralId}/scheduled-status-details`)
      } else {
        return res.redirect(req.session.originPage)
      }
    }

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      req.user.username,
    )

    req.session.groupManagementData.personName = referralDetails.personName

    const presenter = new AddToGroupPresenter(
      groupId,
      req.session.groupManagementData,
      req.session.originPage,
      formError,
    )
    const view = new AddToGroupView(presenter)
    return this.renderPage(res, view)
  }

  async addToGroupMoreDetails(req: Request, res: Response): Promise<void> {
    let formError: FormValidationError | null = null
    let userInputData = null
    const { groupId, referralId } = req.params as Record<string, string>
    const { username } = req.user

    if (req.method === 'POST') {
      const data = await new AddToGroupForm(req).addToGroupMoreDetailsData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const response = await this.accreditedProgrammesManageAndDeliverService.addToGroup(
          username,
          referralId,
          groupId,
          data.paramsForUpdate.additionalDetails,
        )
        const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
          referralId,
          username,
        )
        logger.info(
          {
            event: 'ASSIGN_REFERRAL_TO_GROUP',
            referralId,
            groupId,
            pdu: referralDetails?.pdu,
            user: username,
            userRegion: req.session.userRegion?.regionDescription ?? '',
          },
          'Referral added to group',
        )
        const { message } = response
        return res.redirect(`/group/${groupId}/allocations?message=${encodeURIComponent(message)}`)
      }
    }

    const presenter = new AddToGroupMoreDetailsPresenter(
      groupId,
      req.session.groupManagementData,
      req.session.originPage,
      formError,
      userInputData,
    )
    const view = new AddToGroupMoreDetailsView(presenter)
    return this.renderPage(res, view)
  }
}
