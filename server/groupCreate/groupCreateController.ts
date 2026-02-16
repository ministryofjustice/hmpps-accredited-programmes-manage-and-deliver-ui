import { CreateGroupRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import CreateGroupCyaPresenter from './check-your-answers/groupCreateCyaPresenter'
import CreateGroupCyaView from './check-your-answers/groupCreateCyaView'
import CreateGroupCodePresenter from './code/groupCreateCodePresenter'
import CreateGroupCodeView from './code/groupCreateCodeView'
import CreateGroupCohortPresenter from './cohort/groupCreateCohortPresenter'
import CreateGroupCohortView from './cohort/groupCreateCohortView'
import CreateGroupForm from './groupCreateForm'
import CreateGroupTreatmentManagerPresenter from './treatment-manager/groupCreateTreatmentManagerPresenter'
import CreateGroupTreatmentManagerView from './treatment-manager/groupCreateTreatmentManagerView'
import CreateGroupDatePresenter from './date/groupCreateDatePresenter'
import CreateGroupDateView from './date/groupCreateDateView'
import CreateGroupLocationPresenter from './location/groupCreateLocationPresenter'
import CreateGroupLocationView from './location/groupCreateLocationView'
import CreateGroupPduPresenter from './pdu/groupCreatePduPresenter'
import CreateGroupPduView from './pdu/groupCreatePduView'
import CreateGroupSexPresenter from './sex/groupCreateSexPresenter'
import CreateGroupSexView from './sex/groupCreateSexView'
import CreateGroupStartPresenter from './start/groupCreateStartPresenter'
import CreateGroupStartView from './start/groupCreateStartView'
import CreateGroupWhenPresenter from './when/groupCreateWhenPresenter'
import CreateGroupWhenView from './when/groupCreateWhenView'

export default class CreateGroupController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showCreateGroupStart(req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      return res.redirect('/group/create-a-group/create-group-code')
    }

    // Clear session data at start of journey
    req.session.createGroupFormData = {}

    const presenter = new CreateGroupStartPresenter()
    const view = new CreateGroupStartView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCode(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let userInputData = null
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      let existingGroup = { code: '' }
      if (req.body['create-group-code']) {
        existingGroup = await this.accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion(
          username,
          req.body['create-group-code'],
        )
      }
      const data = await new CreateGroupForm(req, existingGroup.code).createGroupCodeData()
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

    const presenter = new CreateGroupCodePresenter(formError, createGroupFormData, userInputData)
    const view = new CreateGroupCodeView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupDate(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null

    let formDataForPresenter: Partial<CreateGroupRequest> | null = createGroupFormData

    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupDateData()

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

    const presenter = new CreateGroupDatePresenter(formError, formDataForPresenter)
    const view = new CreateGroupDateView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupWhen(req: Request, res: Response): Promise<void> {
    let { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupWhenData()

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
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupCohort(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupCohortData()
      if (data.error) {
        res.status(400)
        formError = data.error
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          cohort: data.paramsForUpdate.cohort,
        }
        return res.redirect(`/group/create-a-group/group-sex`)
      }
    }

    const presenter = new CreateGroupCohortPresenter(formError, createGroupFormData)
    const view = new CreateGroupCohortView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupSex(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupSexData()
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
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupPdu(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupPduData()
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
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupLocation(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupLocationData()
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
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupTreatmentManager(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupTreatmentManagerData()
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
    return ControllerUtils.renderWithLayout(res, view, null)
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
      return res.redirect(`/?groupCreated`)
    }

    const presenter = new CreateGroupCyaPresenter(createGroupFormData)
    const view = new CreateGroupCyaView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }
}
