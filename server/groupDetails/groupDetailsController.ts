import { Request, Response } from 'express'
import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'

export default class GroupDetailsController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showGroupDetailsPage(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as Record<string, string>
    const { username } = req.user
    const { message } = req.query

    req.session.createGroupFormData = {}
    req.session.originPage = req.path

    const successMessage = message ? String(message) : null

    await sendAuditEvent('VIEW_GROUP_DETAILS', username, groupId, 'SEARCH_TERM')

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const presenter = new GroupDetailsPresenter(groupDetails, successMessage)
    const view = new GroupDetailsView(presenter)

    return this.renderPage(res, view)
  }
}
