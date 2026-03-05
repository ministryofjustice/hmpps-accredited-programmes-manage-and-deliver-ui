import { CreateReferralStatusHistory } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import { FormValidationError } from '../utils/formValidationError'
import UpdateReferralStatusForm from './updateReferralStatusForm'
import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import UpdateReferralStatusStartedOrCompletedPresenter from './updateReferralStatusStartedOrCompletedPresenter'
import UpdateReferralStatusStartedOrCompletedView from './updateReferralStatusStartedOrCompletedView'
import UpdateReferralStatusFixedPresenter from './updateReferralStatusToOnProgrammeOrCompletedPresenter'
import UpdateReferralStatusFixedView from './updateReferralStatusToOnProgrammeOrCompletedView'
import UpdateReferralStatusView from './updateReferralStatusView'

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

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails(
      referralId,
      username,
    )

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new UpdateReferralStatusForm(req).data(statusDetails.currentStatus.title)
      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        const response = await this.accreditedProgrammesManageAndDeliverService.updateStatus(
          username,
          referralId,
          data.paramsForUpdate,
        )
        return res.redirect(`/referral/${referralId}/status-history?message=${response.message}`)
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

  async updateStatusStartedOrCompleted(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails(
      referralId,
      username,
    )

    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new UpdateReferralStatusForm(req).startedOrCompletedData(statusDetails.currentStatus.title)
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

    const presenter = new UpdateReferralStatusStartedOrCompletedPresenter(
      referralDetails,
      statusDetails,
      req.session.originPage,
      formError,
      userInputData,
      startedOrCompleted,
    )
    const view = new UpdateReferralStatusStartedOrCompletedView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }

  async updateStatusToOnProgrammeOrCompleted(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const statusDetails = await this.accreditedProgrammesManageAndDeliverService.getStatusTransitionDetails(
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
        let response = { message: '' }
        const updateObject: CreateReferralStatusHistory = {
          referralStatusDescriptionId: statusDetails.suggestedStatus.statusDescriptionId,
          additionalDetails: data.paramsForUpdate.additionalDetails,
        }
        response = await this.accreditedProgrammesManageAndDeliverService.updateStatus(
          username,
          referralId,
          updateObject,
        )

        return res.redirect(`/referral/${referralId}/status-history?message=${response.message}`)
      }
    }

    let backUri = `/referral/${referralId}/update-status-scheduled?startedOrCompleted=true`
    if (statusDetails.currentStatus.title === 'On programme') {
      backUri = `/referral/${referralId}/update-status-on-programme?startedOrCompleted=true`
    }

    const presenter = new UpdateReferralStatusFixedPresenter(
      referralDetails,
      statusDetails,
      backUri,
      req.session.originPage,
      formError,
      userInputData,
    )

    const view = new UpdateReferralStatusFixedView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}
