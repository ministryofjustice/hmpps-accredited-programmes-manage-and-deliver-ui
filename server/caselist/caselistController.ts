import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import CaselistFilter from './caselistFilter'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'

export default class CaselistController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private getCaselistData(req: Request): { username: string; filter: CaselistFilter } {
    const { username } = req.user
    const filter = CaselistFilter.fromRequest(req)
    const pageNumber = req.query.page

    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : undefined
    }

    return { filter, username }
  }

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    const { filter, username } = this.getCaselistData(req)
    const pageNumber = req.query.page
    const { pdu } = req.query
    console.log('---------------')
    console.log(pdu)
    console.log('---------------')

    const openCaseList = await this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      filter.params,
    )

    const presenter = new CaselistPresenter(
      CaselistPageSection.Open,
      openCaseList,
      filter,
      req.session.filterParams,
      true,
      pdu as string,
    )

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showClosedCaselist(req: Request, res: Response): Promise<void> {
    const { username, filter } = this.getCaselistData(req)
    const pageNumber = req.query.page

    const closedCaseList = await this.accreditedProgrammesManageAndDeliverService.getClosedCaselist(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      filter.params,
    )

    const presenter = new CaselistPresenter(
      CaselistPageSection.Closed,
      closedCaseList,
      filter,
      req.session.filterParams,
      false,
    )

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}
