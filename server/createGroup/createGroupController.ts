import { CreateGroupRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../utils/formValidationError'
import BaseController from '../shared/baseController'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import CreateGroupCyaPresenter from './check-your-answers/createGroupCyaPresenter'
import CreateGroupCyaView from './check-your-answers/createGroupCyaView'
import CreateOrEditGroupCodePresenter from './code/createOrEditGroupCodePresenter'
import CreateOrEditGroupCodeView from './code/createOrEditGroupCodeView'
import CreateOrEditGroupCohortPresenter from './cohort/createOrEditGroupCohortPresenter'
import CreateOrEditGroupCohortView from './cohort/createOrEditGroupCohortView'
import CreateOrEditGroupForm from './createOrEditGroupForm'
import CreateOrEditGroupDatePresenter from './date/createOrEditGroupDatePresenter'
import CreateOrEditGroupDateView from './date/createOrEditGroupDateView'
import CreateGroupLocationPresenter from './location/createGroupLocationPresenter'
import CreateGroupLocationView from './location/createGroupLocationView'
import CreateGroupPduPresenter from './pdu/createGroupPduPresenter'
import CreateGroupPduView from './pdu/createGroupPduView'
import CreateGroupSexPresenter from './sex/createGroupSexPresenter'
import CreateGroupSexView from './sex/createGroupSexView'
import CreateGroupStartPresenter from './start/createGroupStartPresenter'
import CreateGroupStartView from './start/createGroupStartView'
import CreateGroupTreatmentManagerPresenter from './treatment-manager/createGroupTreatmentManagerPresenter'
import CreateGroupTreatmentManagerView from './treatment-manager/createGroupTreatmentManagerView'
import CreateGroupWhenPresenter from './when/createGroupWhenPresenter'
import CreateGroupWhenView from './when/createGroupWhenView'

export default class CreateGroupController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showCreateGroupStart(req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      return res.redirect('/group/create-a-group/create-group-code')
    }

    // Clear session data at start of journey
    req.session.createGroupFormData = {}

    const presenter = new CreateGroupStartPresenter()
    const view = new CreateGroupStartView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupCode(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req, '').createGroupCodeData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          groupCode: data.paramsForUpdate.groupCode,
        }
        return res.redirect(`/group/create-a-group/group-start-date`)
      }
    }

    const presenter = new CreateOrEditGroupCodePresenter(formError, createGroupFormData, userInputData)
    const view = new CreateOrEditGroupCodeView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupDate(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null

    let formDataForPresenter: Partial<CreateGroupRequest> | null = createGroupFormData

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createOrEditGroupDateData()

      if (data.error) {
        res.status(400)
        formError = data.error

        formDataForPresenter = {
          ...createGroupFormData,
          earliestStartDate: req.body['create-group-date'],
        }
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          earliestStartDate: data.paramsForUpdate.earliestStartDate,
        }
        return res.redirect(`/group/create-a-group/group-days-and-times`)
      }
    }

    const presenter = new CreateOrEditGroupDatePresenter(formError, formDataForPresenter)
    const view = new CreateOrEditGroupDateView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupWhen(req: Request, res: Response): Promise<void> {
    let { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupWhenData()

      const slots =
        data.paramsForUpdate?.createGroupSessionSlot ||
        ('temporarySlots' in data ? (data.temporarySlots as CreateGroupRequest['createGroupSessionSlot']) : [])

      req.session.createGroupFormData = {
        ...(createGroupFormData || {}),
        createGroupSessionSlot: slots,
      }
      createGroupFormData = req.session.createGroupFormData

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        return res.redirect(`/group/create-a-group/group-cohort`)
      }
    }

    const presenter = new CreateGroupWhenPresenter(
      createGroupFormData?.groupCode,
      createGroupFormData?.createGroupSessionSlot,
      formError,
      userInputData,
    )
    const view = new CreateGroupWhenView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateOrEditGroupCohort(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupCohortData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          cohort: data.paramsForUpdate.cohort,
        }
        return res.redirect(`/group/create-a-group/group-sex`)
      }
    }

    const presenter = new CreateOrEditGroupCohortPresenter(formError, createGroupFormData, userInputData)
    const view = new CreateOrEditGroupCohortView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupSex(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupSexData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          sex: data.paramsForUpdate.sex,
        }
        return res.redirect(`/group/create-a-group/group-probation-delivery-unit`)
      }
    }

    const presenter = new CreateGroupSexPresenter(formError, createGroupFormData)
    const view = new CreateGroupSexView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupPdu(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupPduData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          pduName: data.paramsForUpdate.pduName,
          pduCode: data.paramsForUpdate.pduCode,
        }
        return res.redirect(`/group/create-a-group/group-delivery-location`)
      }
    }

    const pduLocations = await this.accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion(username)

    const presenter = new CreateGroupPduPresenter(pduLocations, formError, createGroupFormData, userInputData)
    const view = new CreateGroupPduView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupLocation(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupLocationData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          deliveryLocationName: data.paramsForUpdate.deliveryLocationName,
          deliveryLocationCode: data.paramsForUpdate.deliveryLocationCode,
        }
        return res.redirect(`/group/create-a-group/group-facilitators`)
      }
    }

    const officeLocations = await this.accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu(
      username,
      req.session.createGroupFormData.pduCode,
    )

    const presenter = new CreateGroupLocationPresenter(officeLocations, formError, createGroupFormData, userInputData)
    const view = new CreateGroupLocationView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupTreatmentManager(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createGroupTreatmentManagerData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          teamMembers: data.paramsForUpdate.teamMembers,
        }
        return res.redirect(`/group/create-a-group/group-review-details`)
      }
    }

    const pduMembers = await this.accreditedProgrammesManageAndDeliverService.getPduMembers(username)
    const presenter = new CreateGroupTreatmentManagerPresenter(
      pduMembers,
      formError,
      createGroupFormData,
      userInputData,
    )
    const view = new CreateGroupTreatmentManagerView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupCya(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    if (req.method === 'POST') {
      await this.accreditedProgrammesManageAndDeliverService.createGroup(
        username,
        createGroupFormData as CreateGroupRequest,
      )
      // Clear session data on submission
      req.session.createGroupFormData = {}
      return res.redirect(`/groups/not-started-or-in-progress?groupCreated`)
    }

    const presenter = new CreateGroupCyaPresenter(createGroupFormData)
    const view = new CreateGroupCyaView(presenter)
    return this.renderPage(res, view)
  }
}
