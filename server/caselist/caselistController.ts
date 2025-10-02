import { Request, Response } from 'express'

import { CaseListFilterValues } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import CaselistFilter from './caselistFilter'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'

export default class CaselistController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private async getCaselistData(
    req: Request,
    openOrClosed: string,
  ): Promise<{
    username: string
    filter: CaselistFilter
    caseListFilters: CaseListFilterValues
  }> {
    const { username } = req.user
    const filter = CaselistFilter.fromRequest(req)
    const pageNumber = req.query.page

    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : undefined
    }

    const caseListFilters = await this.accreditedProgrammesManageAndDeliverService.getCaseListFilters(
      username,
      openOrClosed,
    )

    return { filter, username, caseListFilters }
  }

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    const { filter, username, caseListFilters } = await this.getCaselistData(req, 'OPEN')
    const pageNumber = req.query.page

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
      caseListFilters,
    )

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showClosedCaselist(req: Request, res: Response): Promise<void> {
    const { filter, username, caseListFilters } = await this.getCaselistData(req, 'CLOSED')
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
      caseListFilters,
    )

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}
