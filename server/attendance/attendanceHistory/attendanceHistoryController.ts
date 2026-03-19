import { Request, Response } from 'express'
import AttendanceHistoryPresenter from './attendanceHistoryPresenter'
import BaseController from '../../shared/baseController'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import AttendanceHistoryView from './attendanceHistoryView'
import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'

export default class AttendanceHistoryController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showAttendanceHistoryPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const presenter = new AttendanceHistoryPresenter(referralDetails)
    const view = new AttendanceHistoryView(presenter)

    return this.renderPage(res, view, referralDetails)
  }
}
