import { Request, Response } from 'express'
import { CreateReferralStatusHistory } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import UpdateReferralStatusView from './updateReferralStatusView'
import UpdateReferralStatusForm from './updateReferralStatusForm'
import { FormValidationError } from '../utils/formValidationError'
import UpdateReferralStatusInterimPresenter from './updateReferralStatusInterimPresenter'
import UpdateReferralStatusInterimView from './updateReferralStatusInterimView'
import UpdateReferralStatusFixedPresenter from './updateReferralFixedStatusPresenter'
import UpdateReferralStatusFixedView from './updateReferralFixedStatusView'

export default class UpdateReferralStatusController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async updateStatus(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.getStatusDetails(referralId, username)

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new UpdateReferralStatusForm(req).data(referralDetails.currentStatusDescription)
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        await this.accreditedProgrammesManageAndDeliverService.updateStatus(username, referralId, data.paramsForUpdate)
        return res.redirect(`/referral/${referralId}/status-history?statusUpdated=true`)
      }
    }

    const presenter = new UpdateReferralStatusPresenter(
      referralDetails,
      statusDetails,
      req.session.originPage,
      formError,
      userInputData,
    )

    const view = new UpdateReferralStatusView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }

  async updateStatusInterim(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new UpdateReferralStatusForm(req).interimData(referralDetails.currentStatusDescription)
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        if (data.paramsForUpdate.hasStartedOrCompleted.toLowerCase() === 'true') {
          return res.redirect(`/referral/${referralId}/update-status-details`)
        }
        return res.redirect(`/referral/${referralId}/update-status`)
      }
    }

    const startedOrCompleted = String(req.query.startedOrCompleted || '')

    const presenter = new UpdateReferralStatusInterimPresenter(
      referralDetails,
      req.session.originPage,
      formError,
      userInputData,
      startedOrCompleted,
    )
    const view = new UpdateReferralStatusInterimView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }

  async updateStatusFixed(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new UpdateReferralStatusForm(req).fixedData()
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const PROGRAMME_COMPLETE_STATUS_ID = 'c7afd853-b776-4bbd-8f8d-f868b755279a'
        const ON_PROGRAMME_STATUS_ID = '70b1ae27-2322-4775-81e0-86fa5cc7d477'

        if (referralDetails.currentStatusDescription === 'On programme') {
          const updateObject: CreateReferralStatusHistory = {
            referralStatusDescriptionId: PROGRAMME_COMPLETE_STATUS_ID,
            additionalDetails: data.paramsForUpdate.additionalDetails,
          }
          await this.accreditedProgrammesManageAndDeliverService.updateStatus(username, referralId, updateObject)
        }
        if (referralDetails.currentStatusDescription === 'Scheduled') {
          const updateObject: CreateReferralStatusHistory = {
            referralStatusDescriptionId: ON_PROGRAMME_STATUS_ID,
            additionalDetails: data.paramsForUpdate.additionalDetails,
          }
          await this.accreditedProgrammesManageAndDeliverService.updateStatus(username, referralId, updateObject)
        }
        return res.redirect(`/referral/${referralId}/status-history?statusUpdated=true`)
      }
    }

    let backUri = `/referral/${referralId}/update-status-scheduled?startedOrCompleted=true`
    if (referralDetails.currentStatusDescription === 'On programme') {
      backUri = `/referral/${referralId}/update-status-on-programme?startedOrCompleted=true`
    }

    const presenter = new UpdateReferralStatusFixedPresenter(
      referralDetails,
      backUri,
      req.session.originPage,
      formError,
      userInputData,
    )

    const view = new UpdateReferralStatusFixedView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}
