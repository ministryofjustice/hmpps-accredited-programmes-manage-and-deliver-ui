import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService from '../data/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'
import Caselist from '../models/caseList'
import CaselistFilter from './caselistFilter'

export default class CaselistController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    // const openReferralList = this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(username)
    const filter = CaselistFilter.fromRequest(req)
    req.session.filterParams = req.originalUrl.split('?').pop()
    const openReferralList: Caselist = {
      referrals: [
        { id: 'abc-123', personName: 'Alex River', personCrn: 'X456', status: 'Awaiting Assessment' },
        { id: 'abc-456', personName: 'Billy Bob', personCrn: 'X123', status: 'Another Status' },
        { id: 'abc-789', personName: 'Jimmy Copper', personCrn: 'X987', status: 'Another Status' },
      ],
    }
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
    const closedReferralList: Caselist = {
      referrals: [
        { id: 'abc-123', personName: 'Tony Stark', personCrn: 'X456', status: 'Awaiting Assessment' },
        { id: 'abc-456', personName: 'Steve Rodgers', personCrn: 'X123', status: 'Another Status' },
        { id: 'abc-789', personName: 'Bruce Banner', personCrn: 'X987', status: 'Another Status' },
      ],
    }
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
