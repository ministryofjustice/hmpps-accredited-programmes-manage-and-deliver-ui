import { Request, Response } from 'express'

import { ReferralCaseListItem } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import CaselistFilter from './caselistFilter'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'
import { Page } from '../shared/models/pagination'

export default class CaselistController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private prepareSessionFilterParams(req: Request) {
    const pageNumber = req.query.page
    if (pageNumber === undefined) {
      req.session.filterParams = req.originalUrl.includes('?') ? req.originalUrl.split('?').pop() : undefined
    }
  }

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    this.prepareSessionFilterParams(req)
    const { username } = req.user
    const pageNumber = req.query.page

    const initialFilter = CaselistFilter.fromRequest(req)

    const openCaseList = await this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      initialFilter.params,
    )

    const filter = CaselistFilter.fromRequest(req, openCaseList.filters.locationFilters)

    const presenter = new CaselistPresenter(
      CaselistPageSection.Open,
      openCaseList.pagedReferrals as Page<ReferralCaseListItem>,
      filter,
      req.session.filterParams,
      true,
      openCaseList.filters,
      openCaseList.otherTabTotal,
    )

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showClosedCaselist(req: Request, res: Response): Promise<void> {
    this.prepareSessionFilterParams(req)
    const { username } = req.user
    const pageNumber = req.query.page
    const initialFilter = CaselistFilter.fromRequest(req)

    const closedCaseList = await this.accreditedProgrammesManageAndDeliverService.getClosedCaselist(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 10,
      },
      initialFilter.params,
    )

    const filter = CaselistFilter.fromRequest(req, closedCaseList.filters.locationFilters)

    const presenter = new CaselistPresenter(
      CaselistPageSection.Closed,
      closedCaseList.pagedReferrals as Page<ReferralCaseListItem>,
      filter,
      req.session.filterParams,
      false,
      closedCaseList.filters,
      closedCaseList.otherTabTotal,
    )

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}
