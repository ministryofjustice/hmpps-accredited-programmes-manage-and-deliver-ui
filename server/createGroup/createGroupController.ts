import { Request, Response } from 'express'
import { CreateGroupRequest } from '@manage-and-deliver-api'
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
import CreateOrEditGroupGenderPresenter from './gender/createOrEditGroupGenderPresenter'
import CreateOrEditGroupGenderView from './gender/createOrEditGroupGenderView'
import CreateOrEditGroupLocationPresenter from './location/createOrEditGroupLocationPresenter'
import CreateOrEditGroupLocationView from './location/createOrEditGroupLocationView'
import CreateOrEditGroupPduPresenter from './region/createOrEditGroupPduPresenter'
import CreateOrEditGroupPduView from './region/createOrEditGroupPduView'
import CreateGroupStartPresenter from './start/createGroupStartPresenter'
import CreateGroupStartView from './start/createGroupStartView'
import CreateOrEditGroupTreatmentManagerPresenter from './treatment-manager/createOrEditGroupTreatmentManagerPresenter'
import CreateOrEditGroupTreatmentManagerView from './treatment-manager/createOrEditGroupTreatmentManagerView'
import CreateOrEditGroupWhenPresenter from './when/createOrEditGroupWhenPresenter'
import CreateOrEditGroupWhenView from './when/createOrEditGroupWhenView'

export default class CreateGroupController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Groups

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  private isReturningFromReview(req: Request): boolean {
    const referrer = Array.isArray(req.query.referrer) ? req.query.referrer[0] : req.query.referrer
    return referrer === 'group-review-details'
  }

  private nextCreateGroupRedirect(req: Request, defaultPath: string): string {
    return this.isReturningFromReview(req) ? '/group-review-details' : defaultPath
  }

  async showCreateGroupStart(req: Request, res: Response): Promise<void> {
    if (req.method === 'POST') {
      return res.redirect('/create-group-code')
    }

    // Clear session data at start of journey
    req.session.createGroupFormData = {}

    const presenter = new CreateGroupStartPresenter()
    const view = new CreateGroupStartView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupCode(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { createGroupFormData } = req.session
    let userInputData = null
    let formError: FormValidationError | null = null
    if (req.method === 'POST') {
      let existingGroupCode = ''
      if (req.body['create-group-code']) {
        try {
          const existingGroup = await this.accreditedProgrammesManageAndDeliverService.getGroupByCodeInRegion(
            username,
            req.body['create-group-code'],
          )
          existingGroupCode = existingGroup?.code || ''
        } catch (error) {
          if ((error as { status?: number }).status !== 404) {
            throw error
          }
        }
      }

      const data = await new CreateOrEditGroupForm(req, existingGroupCode).createGroupCodeData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          groupCode: data.paramsForUpdate.groupCode,
        }
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-start-date'))
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
      const userRegionCode = req.session.userRegion?.regionCode
      const data = await new CreateOrEditGroupForm(req, undefined, userRegionCode).createOrEditGroupDateData()

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
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-days-and-times'))
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
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-cohort'))
      }
    }

    const presenter = new CreateOrEditGroupWhenPresenter(
      createGroupFormData?.groupCode,
      createGroupFormData?.createGroupSessionSlot,
      formError,
      userInputData,
    )
    const view = new CreateOrEditGroupWhenView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateOrEditGroupCohort(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
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
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-gender'))
      }
    }

    const presenter = new CreateOrEditGroupCohortPresenter(formError, createGroupFormData, userInputData)
    const view = new CreateOrEditGroupCohortView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateOrEditGroupGender(req: Request, res: Response): Promise<void> {
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
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-probation-delivery-unit'))
      }
    }
    const presenter = new CreateOrEditGroupGenderPresenter(formError, createGroupFormData)
    const view = new CreateOrEditGroupGenderView(presenter)
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
          deliveryLocationName: undefined,
          deliveryLocationCode: undefined,
        }
        const deliveryLocationPath = this.isReturningFromReview(req)
          ? '/group-delivery-location?referrer=group-review-details'
          : '/group-delivery-location'
        return res.redirect(deliveryLocationPath)
      }
    }

    const pduLocations = await this.accreditedProgrammesManageAndDeliverService.getLocationsForUserRegion(username)

    const presenter = new CreateOrEditGroupPduPresenter(pduLocations, formError, createGroupFormData, userInputData)
    const view = new CreateOrEditGroupPduView(presenter)
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
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-facilitators'))
      }
    }

    const officeLocations = await this.accreditedProgrammesManageAndDeliverService.getOfficeLocationsForPdu(
      username,
      req.session.createGroupFormData.pduCode,
    )

    const presenter = new CreateOrEditGroupLocationPresenter(
      officeLocations,
      formError,
      createGroupFormData,
      userInputData,
    )
    const view = new CreateOrEditGroupLocationView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupTreatmentManager(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new CreateOrEditGroupForm(req).createOrEditGroupTreatmentManagerData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          teamMembers: data.paramsForUpdate.teamMembers,
        }
        return res.redirect(this.nextCreateGroupRedirect(req, '/group-review-details'))
      }
    }

    const pduMembers = await this.accreditedProgrammesManageAndDeliverService.getPduMembers(username)
    const presenter = new CreateOrEditGroupTreatmentManagerPresenter(
      '',
      createGroupFormData.groupCode || '',
      pduMembers,
      formError,
      createGroupFormData,
      userInputData,
    )
    const view = new CreateOrEditGroupTreatmentManagerView(presenter)
    return this.renderPage(res, view)
  }

  async showCreateGroupCya(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    const { username } = req.user
    if (req.method === 'POST') {
      const response = await this.accreditedProgrammesManageAndDeliverService.createGroup(
        username,
        createGroupFormData as CreateGroupRequest,
      )
      // Clear session data on submission
      req.session.createGroupFormData = {}
      return res.redirect(
        `/group/${response.id}/schedule-overview?message=${encodeURIComponent(response.successMessage)}`,
      )
    }

    const presenter = new CreateGroupCyaPresenter(createGroupFormData)
    const view = new CreateGroupCyaView(presenter)
    return this.renderPage(res, view)
  }
}
