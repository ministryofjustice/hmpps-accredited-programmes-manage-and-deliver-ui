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

  private filtersDiffer(left: CaselistFilter, right: CaselistFilter): boolean {
    return JSON.stringify(left.params) !== JSON.stringify(right.params)
  }

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    this.prepareSessionFilterParams(req)
    const { username } = req.user
    const pageNumber = req.query.page

    const requestedFilter = CaselistFilter.fromRequest(req)

    let openCaseList = await this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 50,
      },
      requestedFilter.params,
    )

    let filter = CaselistFilter.fromRequest(req, openCaseList.filters.locationFilters)

    // If incoming reporting teams don't belong to the selected PDU,
    // fetch once more with updated filter params so results and filters match.
    if (this.filtersDiffer(requestedFilter, filter)) {
      openCaseList = await this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(
        username,
        {
          page: pageNumber ? Number(pageNumber) - 1 : 0,
          size: 50,
        },
        filter.params,
      )
      filter = CaselistFilter.fromRequest(req, openCaseList.filters.locationFilters)
    }

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

    const requestedFilter = CaselistFilter.fromRequest(req)

    let closedCaseList = await this.accreditedProgrammesManageAndDeliverService.getClosedCaselist(
      username,
      {
        page: pageNumber ? Number(pageNumber) - 1 : 0,
        size: 50,
      },
      requestedFilter.params,
    )

    let filter = CaselistFilter.fromRequest(req, closedCaseList.filters.locationFilters)

    // If incoming reporting teams don't belong to the selected PDU,
    // fetch once more with updated filter params so results and filters match.
    if (this.filtersDiffer(requestedFilter, filter)) {
      closedCaseList = await this.accreditedProgrammesManageAndDeliverService.getClosedCaselist(
        username,
        {
          page: pageNumber ? Number(pageNumber) - 1 : 0,
          size: 50,
        },
        filter.params,
      )
      filter = CaselistFilter.fromRequest(req, closedCaseList.filters.locationFilters)
    }

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
