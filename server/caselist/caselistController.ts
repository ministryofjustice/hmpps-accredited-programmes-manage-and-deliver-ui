import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService from '../data/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'
import CaselistFilter from './caselistFilter'

export default class CaselistController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const openReferralList = await this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(username)
    const filter = CaselistFilter.fromRequest(req)
    req.session.filterParams = req.originalUrl.split('?').pop()
    const presenter = new CaselistPresenter(
      CaselistPageSection.Open,
      openReferralList,
      filter,
      req.session.filterParams,
    )
    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view)
  }

  async showClosedCaselist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const closedReferralList = await this.accreditedProgrammesManageAndDeliverService.getClosedCaselist(username)
    const filter = CaselistFilter.fromRequest(req)
    req.session.filterParams = req.originalUrl.split('?').pop()
    const presenter = new CaselistPresenter(
      CaselistPageSection.Closed,
      closedReferralList,
      filter,
      req.session.filterParams,
    )
    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view)
  }
}
