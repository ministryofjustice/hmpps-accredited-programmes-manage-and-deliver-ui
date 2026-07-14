import { CreateGroupRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import RescheduleOtherSessionsForm from '../editSession/dateAndTime/rescheduleOtherSessionsForm'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import sendAuditEvent from '../services/auditService'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import { FormValidationError } from '../utils/formValidationError'
import CreateOrEditGroupCodePresenter from './code/createOrEditGroupCodePresenter'
import CreateOrEditGroupCodeView from './code/createOrEditGroupCodeView'
import CreateOrEditGroupCohortPresenter from './cohort/createOrEditGroupCohortPresenter'
import CreateOrEditGroupCohortView from './cohort/createOrEditGroupCohortView'
import CreateOrEditGroupForm from './createOrEditGroupForm'
import CreateOrEditGroupDatePresenter from './date/createOrEditGroupDatePresenter'
import CreateOrEditGroupDateView from './date/createOrEditGroupDateView'
import RescheduleSessionsPresenter from './date/rescheduleSessionPresenter'
import RescheduleSessionsView from './date/rescheduleSessionView'
import CreateOrEditGroupGenderPresenter from './gender/createOrEditGroupGenderPresenter'
import CreateOrEditGroupGenderView from './gender/createOrEditGroupGenderView'
import CreateOrEditGroupLocationPresenter from './location/createOrEditGroupLocationPresenter'
import CreateOrEditGroupLocationView from './location/createOrEditGroupLocationView'
import CreateOrEditGroupPduPresenter from './region/createOrEditGroupPduPresenter'
import CreateOrEditGroupPduView from './region/createOrEditGroupPduView'
import CreateOrEditGroupTreatmentManagerPresenter from './treatment-manager/createOrEditGroupTreatmentManagerPresenter'
import CreateOrEditGroupTreatmentManagerView from './treatment-manager/createOrEditGroupTreatmentManagerView'
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
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let formError: FormValidationError | null = null

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_DATE', username, groupId, 'SEARCH_TERM')
    }
    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const groupData: Partial<CreateGroupRequest> = {
      groupCode: groupDetails?.code,
      earliestStartDate: req.session.createGroupFormData?.earliestStartDate
        ? req.session.createGroupFormData.earliestStartDate
        : new Date(groupDetails?.startDate).toLocaleDateString('en-GB'),
    }

    if (req.method === 'POST') {
      const userRegionCode = req.session.userRegion?.regionCode
      const data = await new CreateOrEditGroupForm(req, undefined, userRegionCode).createOrEditGroupDateData()

      if (data.error) {
        res.status(400)
        formError = data.error
        groupData.earliestStartDate = req.body['create-group-date']
      } else {
        req.session.createGroupFormData = {
          ...groupData,
          earliestStartDate: data.paramsForUpdate.earliestStartDate,
          previousDate: groupDetails?.startDate,
        }
        return res.redirect(`/${groupId}/edit-start-date-rescheduled`)
      }
    }

    const presenter = new CreateOrEditGroupDatePresenter(formError, groupData, groupId)
    const view = new CreateOrEditGroupDateView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupRescheduleDate(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let formError: FormValidationError | null = null

    const updatedGroupDetails = req.session.createGroupFormData

    if (req.method === 'POST') {
      const data = await new RescheduleOtherSessionsForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        await sendAuditEvent('EDIT_GROUP_RESCHEDULE_DATE', username, groupId, 'SEARCH_TERM', {
          details: {
            earliestStartDate: updatedGroupDetails.earliestStartDate,
            automaticallyRescheduleOtherSessions: data.paramsForUpdate.rescheduleOtherSessions,
          },
        })
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
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    let userInputData: Record<string, unknown> | null = null

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_DAYS_AND_TIMES', username, groupId, 'SEARCH_TERM')
    }
    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getBffEditGroupDaysAndTimes(
      username,
      groupId,
    )

    // Use session data if it exists and has slots, otherwise use API data
    if (!createGroupFormData?.createGroupSessionSlot || createGroupFormData.createGroupSessionSlot.length === 0) {
      req.session.createGroupFormData = {
        groupCode: groupDetails.code,
        createGroupSessionSlot: groupDetails.programmeGroupSessionSlots,
      }
      createGroupFormData = req.session.createGroupFormData
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
        return res.redirect(`/${groupId}/edit-group-days-and-times/reschedule`)
      }
    }

    const presenter = new CreateOrEditGroupWhenPresenter(
      groupDetails.code,
      createGroupFormData.createGroupSessionSlot,
      formError,
      userInputData,
      groupId,
    )
    const view = new CreateOrEditGroupWhenView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupRescheduleDayTimes(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let formError: FormValidationError | null = null

    const updatedGroupDetails = req.session.createGroupFormData

    if (req.method === 'POST') {
      const data = await new RescheduleOtherSessionsForm(req).rescheduleSessionDetailsData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        await sendAuditEvent('EDIT_GROUP_RESCHEDULE_DAYS_AND_TIMES', username, groupId, 'SEARCH_TERM', {
          details: {
            createGroupSessionSlot: updatedGroupDetails.createGroupSessionSlot,
            automaticallyRescheduleOtherSessions: data.paramsForUpdate.rescheduleOtherSessions,
          },
        })
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

  async editGroupSex(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_GENDER', username, groupId, 'SEARCH_TERM')
    }
    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const editGroupSexData = await this.accreditedProgrammesManageAndDeliverService.getGroupSexDetails(
      username,
      groupId,
    )
    const selectedSex = editGroupSexData.radios.find(
      (radio: { selected: boolean; value: string }) => radio.selected,
    )?.value

    const createGroupFormData = {
      sex: selectedSex || groupDetails?.sex,
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupSexData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await sendAuditEvent('EDIT_GROUP_GENDER', username, groupId, 'SEARCH_TERM', {
          details: { sex: data.paramsForUpdate.sex },
        })
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          sex: data.paramsForUpdate.sex,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }

    const presenter = new CreateOrEditGroupGenderPresenter(
      formError,
      createGroupFormData,
      userInputData,
      groupId,
      groupDetails?.code,
    )
    const view = new CreateOrEditGroupGenderView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupCohort(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_COHORT', username, groupId, 'SEARCH_TERM')
    }
    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const bffEditGroupCohortData = await this.accreditedProgrammesManageAndDeliverService.getBffEditGroupCohort(
      username,
      groupId,
    )
    const selectedCohort = bffEditGroupCohortData.radios.find(
      (radio: { selected: boolean; value: string }) => radio.selected,
    )?.value

    const createGroupFormData = {
      cohort: selectedCohort || groupDetails?.cohort,
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupCohortData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await sendAuditEvent('EDIT_GROUP_COHORT', username, groupId, 'SEARCH_TERM', {
          details: { cohort: data.paramsForUpdate.cohort },
        })
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          cohort: data.paramsForUpdate.cohort,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }

    const presenter = new CreateOrEditGroupCohortPresenter(
      formError,
      createGroupFormData,
      userInputData,
      groupId,
      groupDetails?.code,
    )
    const view = new CreateOrEditGroupCohortView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupCode(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_CODE', username, groupId, 'SEARCH_TERM')
    }
    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const createGroupFormData = {
      groupCode: groupDetails?.code,
    }

    if (req.method === 'POST') {
      let existingGroup = { code: '' }

      if (req.body['create-group-code']) {
        await sendAuditEvent('VIEW_CHECK_GROUP_CODE', username, groupId, 'SEARCH_TERM', {
          details: { code: req.body['create-group-code'] },
        })
        const matchingGroup = await this.accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion(
          username,
          req.body['create-group-code'],
        )

        existingGroup = matchingGroup?.id === groupId ? { code: '' } : { code: matchingGroup?.code || '' }
      }

      const data = await new CreateOrEditGroupForm(req, existingGroup.code).createGroupCodeData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await sendAuditEvent('EDIT_GROUP_CODE', username, groupId, 'SEARCH_TERM', {
          details: { groupCode: data.paramsForUpdate.groupCode },
        })
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          groupCode: data.paramsForUpdate.groupCode,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }

    const presenter = new CreateOrEditGroupCodePresenter(
      formError,
      createGroupFormData,
      userInputData,
      groupId,
      createGroupFormData.groupCode,
    )
    const view = new CreateOrEditGroupCodeView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupPdu(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null
    req.session.originPage = req.path

    if (!createGroupFormData?.pduCode) {
      if (req.method === 'GET') {
        await sendAuditEvent('VIEW_EDIT_GROUP_PDU', username, groupId, 'GROUP')
      }
      const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
      req.session.createGroupFormData = {
        groupCode: groupDetails.code,
        pduName: groupDetails.pduName,
        pduCode: groupDetails.pduCode,
        deliveryLocationCode: groupDetails.deliveryLocationCode,
        deliveryLocationName: groupDetails.deliveryLocation,
      }
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupPduData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...req.session.createGroupFormData,
          pduName: data.paramsForUpdate.pduName,
          pduCode: data.paramsForUpdate.pduCode,
        }
        return res.redirect(`/${groupId}/edit-group-delivery-location`)
      }
    }
    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_PDU', username, undefined, 'NOT_APPLICABLE', { groupId })
    }
    const pduLocations = await this.accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion(username)

    const presenter = new CreateOrEditGroupPduPresenter(
      pduLocations,
      formError,
      req.session.createGroupFormData,
      userInputData,
      groupId,
      true,
    )
    const view = new CreateOrEditGroupPduView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupLocation(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null
    let viewAuditSent = false

    if (!createGroupFormData?.deliveryLocationCode) {
      if (req.method === 'GET') {
        await sendAuditEvent('VIEW_EDIT_GROUP_LOCATION', username, groupId, 'SEARCH_TERM')
        viewAuditSent = true
      }
      const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
      req.session.createGroupFormData = {
        groupCode: groupDetails.code,
        pduName: groupDetails.pduName,
        pduCode: groupDetails.pduCode,
        deliveryLocationCode: groupDetails.deliveryLocationCode,
        deliveryLocationName: groupDetails.deliveryLocation,
      }
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupLocationData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...req.session.createGroupFormData,
          deliveryLocationName: data.paramsForUpdate.deliveryLocationName,
          deliveryLocationCode: data.paramsForUpdate.deliveryLocationCode,
        }
        await sendAuditEvent('EDIT_GROUP_LOCATION', username, groupId, 'SEARCH_TERM', {
          details: req.session.createGroupFormData,
        })
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(
          username,
          groupId,
          req.session.createGroupFormData,
        )
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }
    if (!viewAuditSent) {
      await sendAuditEvent('VIEW_EDIT_GROUP_LOCATION', username, groupId, 'SEARCH_TERM')
    }
    const officeLocations = await this.accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu(
      username,
      req.session.createGroupFormData.pduCode,
    )

    const presenter = new CreateOrEditGroupLocationPresenter(
      officeLocations,
      formError,
      req.session.createGroupFormData,
      userInputData,
      groupId,
      true,
      req.session.originPage,
    )
    const view = new CreateOrEditGroupLocationView(presenter)
    return this.renderPage(res, view)
  }

  async editGroupTreatmentManager(req: Request, res: Response): Promise<void> {
    const { groupId } = req.params as { groupId: string }
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null

    if (req.method === 'GET') {
      await sendAuditEvent('VIEW_EDIT_GROUP_TREATMENT_FACILITATORS', username, groupId, 'SEARCH_TERM')
    }
    const groupDetails = await this.accreditedProgrammesManageAndDeliverService.getGroupDetailsById(username, groupId)
    const pduMembers = await this.accreditedProgrammesManageAndDeliverService.getPduMembers(username)

    const createGroupFormData = {
      groupCode: groupDetails?.code,
      teamMembers: [
        ...(groupDetails?.treatmentManager ? [groupDetails.treatmentManager] : []),
        ...(groupDetails?.facilitators || []),
        ...(groupDetails?.coverFacilitators || []),
      ],
    }

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createOrEditGroupTreatmentManagerData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await sendAuditEvent('EDIT_GROUP_TREATMENT_FACILITATORS', username, groupId, 'SEARCH_TERM', {
          details: { teamMembers: data.paramsForUpdate.teamMembers },
        })
        const response = await this.accreditedProgrammesManageAndDeliverService.updateGroup(username, groupId, {
          teamMembers: data.paramsForUpdate.teamMembers,
        })

        req.session.createGroupFormData = {}
        return res.redirect(`/group/${groupId}/group-details?message=${encodeURIComponent(response.successMessage)}`)
      }
    }

    const presenter = new CreateOrEditGroupTreatmentManagerPresenter(
      groupId,
      createGroupFormData.groupCode || '',
      pduMembers,
      formError,
      createGroupFormData,
      userInputData,
    )
    const view = new CreateOrEditGroupTreatmentManagerView(presenter)
    return this.renderPage(res, view)
  }
}
