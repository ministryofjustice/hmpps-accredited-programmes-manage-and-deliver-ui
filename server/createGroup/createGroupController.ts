import { CreateGroupRequest } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import CreateGroupCodePresenter from './createGroupCodePresenter'
import CreateGroupCodeView from './createGroupCodeView'
import CreateGroupDatePresenter from './createGroupDatePresenter'
import CreateGroupDateView from './createGroupDateView'
import CreateGroupWhenPresenter from './createGroupWhenPresenter'
import CreateGroupWhenView from './createGroupWhenView'
import CreateGroupCohortPresenter from './createGroupCohortPresenter'
import CreateGroupCohortView from './createGroupCohortView'
import CreateGroupCyaPresenter from './createGroupCyaPresenter'
import CreateGroupCyaView from './createGroupCyaView'
import CreateGroupForm from './createGroupForm'
import CreateGroupSexPresenter from './createGroupSexPresenter'
import CreateGroupSexView from './createGroupSexView'
import CreateGroupStartPresenter from './createGroupStartPresenter'
import CreateGroupStartView from './createGroupStartView'
import CreateGroupPduPresenter from './createGroupPduPresenter'
import CreateGroupPduView from './createGroupPduView'
import CreateGroupLocationPresenter from './createGroupLocationPresenter'
import CreateGroupLocationView from './createGroupLocationView'
import CreateGroupTreatmentManagerPresenter from './createGroupTreatmentManagerPresenter'
import CreateGroupTreatmentManagerView from './createGroupTreatmentManagerView'

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
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          groupCode: data.paramsForUpdate.groupCode,
        }
        return res.redirect(`/group/create-a-group/group-start-date`)
      }
    }

    const presenter = new CreateGroupCodePresenter(formError, createGroupFormData)
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
          startedAtDate: req.body['create-group-date'],
        }
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          startedAtDate: data.paramsForUpdate.startedAtDate,
        }
        return res.redirect(`/group/create-a-group/group-days-and-times`)
      }
    }

    const presenter = new CreateGroupDatePresenter(formError, formDataForPresenter)
    const view = new CreateGroupDateView(presenter)
    return ControllerUtils.renderWithLayout(res, view, null)
  }

  async showCreateGroupWhen(req: Request, res: Response): Promise<void> {
    const { createGroupFormData } = req.session
    let formError: FormValidationError | null = null

    let formDataForPresenter: Partial<CreateGroupRequest> | null = createGroupFormData

    if (req.method === 'POST') {
      const data = await new CreateGroupForm(req).createGroupWhenData()

      if (data.error) {
        res.status(400)
        formError = data.error

        const raw = req.body['days-of-week']
        const days: string[] = []
        if (Array.isArray(raw)) {
          days.push(...raw)
        } else if (raw) {
          days.push(raw)
        }

        const slots =
          days.length === 0
            ? []
            : days.map(dayOfWeek => {
                const dayKey = dayOfWeek.toLowerCase()

                const hourRaw = req.body[`${dayKey}-hour`]
                const minuteRaw = req.body[`${dayKey}-minute`]
                const ampmRaw = req.body[`${dayKey}-ampm`]

                const hour = hourRaw ? Number(hourRaw) : undefined

                let minutes: number | undefined
                if (minuteRaw !== '' && minuteRaw !== undefined) {
                  minutes = Number(minuteRaw)
                }

                let amOrPm: 'AM' | 'PM' | undefined
                if (ampmRaw) {
                  const upper = (ampmRaw as string).toUpperCase()
                  if (upper === 'AM' || upper === 'PM') {
                    amOrPm = upper as 'AM' | 'PM'
                  }
                }

                return {
                  dayOfWeek: dayOfWeek as
                    | 'MONDAY'
                    | 'TUESDAY'
                    | 'WEDNESDAY'
                    | 'THURSDAY'
                    | 'FRIDAY'
                    | 'SATURDAY'
                    | 'SUNDAY',
                  hour,
                  minutes,
                  amOrPm,
                }
              })

        formDataForPresenter = {
          ...createGroupFormData,
          createGroupSessionSlot: slots,
        }
      } else {
        req.session.createGroupFormData = {
          ...createGroupFormData,
          createGroupSessionSlot: data.paramsForUpdate.createGroupSessionSlot,
        }
        return res.redirect(`/group/create-a-group/group-days-and-times`)
      }
    }

    const presenter = new CreateGroupWhenPresenter(formError, formDataForPresenter)
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
        return res.redirect(`/group/create-a-group/treatment-manager`)
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
