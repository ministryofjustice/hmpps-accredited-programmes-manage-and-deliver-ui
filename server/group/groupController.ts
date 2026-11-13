import { Request, Response } from 'express'
import { Group } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import GroupPresenter, { GroupListPageSection } from './groupPresenter'
import GroupView from './groupView'
import { Page } from '../shared/models/pagination'
import GroupListFilter from '../groupOverview/groupListFilter'
import BaseController from '../shared/baseController'
import sendAuditEvent from '../services/auditService'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import RetainedFilters from '../shared/filters/retainedFilters'
import { GroupDateSortField, parseGroupSort } from './groupSort'

export default class GroupController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  private readonly retainedFilters = new RetainedFilters('groups')

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  private filtersDiffer(left: GroupListFilter, right: GroupListFilter): boolean {
    return JSON.stringify(left.params) !== JSON.stringify(right.params)
  }

  private prepareSessionFilterParams(req: Request, sort: string) {
    const filterParams = new URLSearchParams(req.originalUrl.split('?')[1] ?? '')
    filterParams.delete('page')
    if (req.query.sort !== undefined) {
      filterParams.set('sort', sort)
    }
    req.session.filterParams = filterParams.toString() || undefined
  }

  private paginationParams(req: Request, dateField: GroupDateSortField = 'startedAtDate') {
    const pageNumber = typeof req.query.page === 'string' ? Number(req.query.page) : NaN
    const sortValues = typeof req.query.sort === 'string' ? [req.query.sort] : []
    const [sortField, sortDirection] = parseGroupSort(sortValues, dateField)

    return {
      page: Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0,
      size: 50,
      sort: [`${sortField},${sortDirection}`],
    }
  }

  async showNotStartedGroupListPage(req: Request, res: Response): Promise<void> {
    const clearPath = this.retainedFilters.clearRedirectPath(req)
    if (clearPath) {
      return res.redirect(clearPath)
    }
    const restoredUrl = this.retainedFilters.restoreRedirectUrl(req)
    if (restoredUrl) {
      return res.redirect(restoredUrl)
    }
    this.retainedFilters.persist(req)

    const { username } = req.user
    const selectedTab = 'NOT_STARTED_OR_IN_PROGRESS'

    const requestedFilter = GroupListFilter.fromRequest(req)
    const paginationParams = this.paginationParams(req, 'earliestPossibleStartDate')
    this.prepareSessionFilterParams(req, paginationParams.sort[0])
    await sendAuditEvent('SEARCH_NOT_STARTED_OR_IN_PROGRESS_GROUP_LIST', username, undefined, 'NOT_APPLICABLE', {
      filter: requestedFilter.params,
    })

    let notStartedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
      username,
      paginationParams,
      requestedFilter.params,
      selectedTab,
    )

    let filters = GroupListFilter.fromRequest(req, notStartedGroupList.deliveryLocationNames)

    if (this.filtersDiffer(requestedFilter, filters)) {
      notStartedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
        username,
        paginationParams,
        filters.params,
        selectedTab,
      )
      filters = GroupListFilter.fromRequest(req, notStartedGroupList.deliveryLocationNames)
    }

    const presenter = new GroupPresenter(
      notStartedGroupList.pagedGroupData as Page<Group>,
      GroupListPageSection.NOT_STARTED_OR_IN_PROGRESS,
      notStartedGroupList.otherTabTotal,
      notStartedGroupList.regionName,
      filters,
      notStartedGroupList.probationDeliveryUnitNames,
      notStartedGroupList.deliveryLocationNames,
      undefined,
      req.session.filterParams,
    )
    const view = new GroupView(presenter)

    return this.renderPage(res, view)
  }

  async showCompletedGroupListPage(req: Request, res: Response): Promise<void> {
    const clearPath = this.retainedFilters.clearRedirectPath(req)
    if (clearPath) {
      return res.redirect(clearPath)
    }
    const restoredUrl = this.retainedFilters.restoreRedirectUrl(req)
    if (restoredUrl) {
      return res.redirect(restoredUrl)
    }
    this.retainedFilters.persist(req)

    const { username } = req.user
    const selectedTab = 'COMPLETE'

    const requestedFilter = GroupListFilter.fromRequest(req)
    const paginationParams = this.paginationParams(req)
    this.prepareSessionFilterParams(req, paginationParams.sort[0])
    await sendAuditEvent('SEARCH_COMPLETED_GROUP_LIST', username, undefined, 'NOT_APPLICABLE', {
      filter: requestedFilter.params,
    })

    let completedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
      username,
      paginationParams,
      requestedFilter.params,
      selectedTab,
    )

    let filters = GroupListFilter.fromRequest(req, completedGroupList.deliveryLocationNames)

    if (this.filtersDiffer(requestedFilter, filters)) {
      completedGroupList = await this.accreditedProgrammesManageAndDeliverService.getGroupList(
        username,
        paginationParams,
        filters.params,
        selectedTab,
      )
      filters = GroupListFilter.fromRequest(req, completedGroupList.deliveryLocationNames)
    }

    const presenter = new GroupPresenter(
      completedGroupList.pagedGroupData as Page<Group>,
      GroupListPageSection.COMPLETE,
      completedGroupList.otherTabTotal,
      completedGroupList.regionName,
      filters,
      completedGroupList.probationDeliveryUnitNames,
      completedGroupList.deliveryLocationNames,
      undefined,
      req.session.filterParams,
    )
    const view = new GroupView(presenter)

    return this.renderPage(res, view)
  }
}
