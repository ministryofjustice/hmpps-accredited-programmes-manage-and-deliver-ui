import { Request, Response } from 'express'
import GroupDetailsPresenter from './groupDetailsPresenter'
import GroupDetailsView from './groupDetailsView'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'

export default class GroupDetailsController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showGroupDetailsPage(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user

    // const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion(
    //   username,
    //   groupId,
    // )

    const groupDetails = {
      id: '0a81dd15-3580-4ba6-9d7f-fe7ea1a5a605',
      code: 'AP_BIRMINGHAM_NORTH',
      regionName: 'West Midlands',
      startDate: 'Thursday 23 April 2026',
      pduName: 'County Durham and Darlington',
      deliveryLocation: 'County Durham Probation Office',
      cohort: 'General Offence LDC',
      sex: 'Male',
      daysAndTimes: ['Mondays, 11am to 1:30pm', 'Thursdays, 11am to 1:30pm'],
      currentlyAllocatedNumber: 9,
      treatmentManager: 'Chloe Pascal',
      facilitators: ['Harpreet Singh', 'Tom Bassett'],
      coverFacilitators: ['Tom Saunders'],
    }

    console.log(groupDetails)
    const presenter = new GroupDetailsPresenter(groupDetails)
    const view = new GroupDetailsView(presenter)

    return this.renderPage(res, view)
  }
}
