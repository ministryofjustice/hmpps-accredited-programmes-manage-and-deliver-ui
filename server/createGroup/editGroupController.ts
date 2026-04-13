import { CreateGroupRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../utils/formValidationError'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import CreateOrEditGroupDatePresenter from './date/createOrEditGroupDatePresenter'
import CreateOrEditGroupDateView from './date/createOrEditGroupDateView'
import CreateOrEditGroupForm from './createOrEditGroupForm'
import RescheduleSessionsPresenter from './date/rescheduleSessionPresenter'
import RescheduleSessionsView from './date/rescheduleSessionView'
import RescheduleOtherSessionsForm from '../editSession/dateAndTime/rescheduleOtherSessionsForm'
import CreateOrEditGroupWhenPresenter from './when/createOrEditGroupWhenPresenter'
import CreateOrEditGroupWhenView from './when/createOrEditGroupWhenView'

export default class EditGroupController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async editGroupDate(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const groupData: Partial<CreateGroupRequest> = {
      groupCode: groupDetails?.code,
      earliestStartDate: req.session.createGroupFormData?.earliestStartDate
        ? req.session.createGroupFormData.earliestStartDate
        : new Date(groupDetails?.startDate).toLocaleDateString('en-GB'),
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createOrEditGroupDateData()

      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...groupData,
          earliestStartDate: data.paramsForUpdate.earliestStartDate,
          previousDate: groupDetails?.startDate,
        }
        return res.redirect(`/group/${groupId}/edit-start-date-rescheduled`)
      }
    }

    const presenter = new CreateOrEditGroupDatePresenter(formError, groupData, groupId, true)
    const view = new CreateOrEditGroupDateView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupRescheduleDate(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const updatedGroupDetails = req.session.createGroupFormData

    if (req.method === 'POST') {
      const data = await new RescheduleOtherSessionsForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          earliestStartDate: updatedGroupDetails.earliestStartDate,
          automaticallyRescheduleOtherSessions: data.paramsForUpdate.rescheduleOtherSessions,
        })
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }

    const presenter = new RescheduleSessionsPresenter(groupId, updatedGroupDetails, true, formError)
    const view = new RescheduleSessionsView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupDaysAndTimes(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    let userInputData: Record<string, unknown> | null = null

    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getBffEditGroupDaysAndTimes(
      username,
      groupId,
    )

    // Use session data if it exists and has slots, otherwise use API data
    if (!createGroupFormData?.createGroupSessionSlot || createGroupFormData.createGroupSessionSlot.length === 0) {
      if (!createGroupFormData) {
        createGroupFormData = { groupCode: groupDetails.code }
      }
      createGroupFormData.createGroupSessionSlot = groupDetails.programmeGroupSessionSlots
      req.session.createGroupFormData = createGroupFormData
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupWhenData()

      const slots =
        data.paramsForUpdate?.createGroupSessionSlot ||
        ('temporarySlots' in data ? (data.temporarySlots as CreateGroupRequest['createGroupSessionSlot']) : [])

      req.session.createGroupFormData = {
        groupCode: groupDetails.code,
        createGroupSessionSlot: slots,
      }
      createGroupFormData = req.session.createGroupFormData

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...req.session.createGroupFormData,
          previousSessions: groupDetails.programmeGroupSessionSlots,
        }
        return res.redirect(`/group/${groupId}/edit-group-days-and-times-rescheduled`)
      }
    }

    const presenter = new CreateOrEditGroupWhenPresenter(
      groupDetails.code,
      createGroupFormData.createGroupSessionSlot,
      formError,
      userInputData,
      true,
      groupId,
    )
    const view = new CreateOrEditGroupWhenView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupRescheduleDayTimes(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null

    const updatedGroupDetails = req.session.createGroupFormData

    if (req.method === 'POST') {
      const data = await new RescheduleOtherSessionsForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          createGroupSessionSlot: updatedGroupDetails.createGroupSessionSlot,
          automaticallyRescheduleOtherSessions: data.paramsForUpdate.rescheduleOtherSessions,
        })
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }

    const presenter = new RescheduleSessionsPresenter(groupId, updatedGroupDetails, false, formError)
    const view = new RescheduleSessionsView(presenter)
    return this.renderPage(res, view)
  }
}
