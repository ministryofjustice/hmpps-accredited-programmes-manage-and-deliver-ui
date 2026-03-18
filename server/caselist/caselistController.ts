import { Request, Response } from 'express'
import { ReferralCaseListItem } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { Page } from '../shared/models/pagination'
import CaselistFilter from './caselistFilter'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'

export default class CaselistController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

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
        size: 50,
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
      req.session.userLocation?.locationDescription ?? '',
    )

    const view = new CaselistView(presenter)

    return this.renderPage(res, view)
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
        size: 50,
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
      req.session.userLocation?.locationDescription ?? '',
    )

    const view = new CaselistView(presenter)

    return this.renderPage(res, view)
  }
}
