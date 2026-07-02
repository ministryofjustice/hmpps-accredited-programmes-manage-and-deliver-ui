import { CreateReferralStatusHistory } from '@manage-and-deliver-api'
import { Request, Response } from 'express'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import errorMessages from '../utils/errorMessages'
import { FormValidationError } from '../utils/formValidationError'
import { SanitisedError } from '../sanitisedError'
import UpdateReferralStatusForm from './updateReferralStatusForm'
import UpdateReferralStatusPresenter from './updateReferralStatusPresenter'
import UpdateReferralStatusStartedOrCompletedPresenter from './updateReferralStatusStartedOrCompletedPresenter'
import UpdateReferralStatusStartedOrCompletedView from './updateReferralStatusStartedOrCompletedView'
import UpdateReferralStatusFixedPresenter from './updateReferralStatusToOnProgrammeOrCompletedPresenter'
import UpdateReferralStatusFixedView from './updateReferralStatusToOnProgrammeOrCompletedView'
import UpdateReferralStatusView from './updateReferralStatusView'
import logger from '../../logger'
import sendAuditEvent from '../services/auditService'

/**
 * Build a FormValidationError for a single field. Mirrors the shape produced by
 * FormUtils.validationErrorFromResult so views/presenters can render it as a
 * normal field-level error.
 */
function singleFieldValidationError(field: string, message: string): FormValidationError {
  return {
    errors: [{ formFields: [field], errorSummaryLinkedField: field, message }],
  }
}

/**
 * The API now (APG-2383) returns 400 with this userMessage prefix when the
 * requested status transition is not configured. We detect it here so we can
 * re-render the form with a friendly inline error rather than a generic 500.
 */
function isInvalidTransitionError(error: unknown): boolean {
  const e = error as SanitisedError
  if (e?.status !== 400) return false
  const userMessage = (e.data as { userMessage?: string } | undefined)?.userMessage ?? ''
  return userMessage.includes('Invalid referral status transition')
}

export default class UpdateReferralStatusController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async updateStatus(req: Request, res: Response): Promise<void> {
    // Prevent the browser caching the form page so Back-button does not
    // replay a stale view / re-POST against a referral whose state has moved on.
    res.set('Cache-Control', 'no-store')

    const { referralId } = req.params as Record<string, string>
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
        // Guard against a stale form whose selected status id is no longer a
        // valid next state for this referral (e.g. another tab moved the
        // referral on, or the user used the Back button after a previous
        // submission). Without this the BFF would forward an out-of-date id
        // to the API, which since APG-2383 will respond 400.
        const submittedStatusId = data.paramsForUpdate.referralStatusDescriptionId
        const isStillValid = statusDetails.availableStatuses.some(s => s.id === submittedStatusId)
        if (!isStillValid) {
          res.status(409)
          formError = singleFieldValidationError('updated-status', errorMessages.updateStatus.transitionChanged)
          userInputData = req.body
        } else {
          try {

              await sendAuditEvent('EDIT_REFERRAL_STATUS', username, referralDetails?.crn, 'CRN', {
                referralId,
                updatedStatusId: data.paramsForUpdate.referralStatusDescriptionId,
              })
            const response = await this.accreditedProgrammesManageAndDeliverService.updateStatus(
              username,
              referralId,
              data.paramsForUpdate,
            )
            logger.info(
              {
                event: 'UPDATE_REFERRAL_STATUS',
                referralId,
                pdu: referralDetails?.pdu,
                user: username,
                userRegion: req.session.userRegion?.regionDescription ?? '',
              },
              'Referral status updated',
            )
            return res.redirect(`/referral/${referralId}/status-history?message=${response.message}`)
          } catch (error) {
            if (isInvalidTransitionError(error)) {
              res.status(409)
              formError = singleFieldValidationError('updated-status', errorMessages.updateStatus.invalidTransition)
              userInputData = req.body
            } else {
              throw error
            }
          }
        }
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
    res.set('Cache-Control', 'no-store')

    const { referralId } = req.params as Record<string, string>
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
    res.set('Cache-Control', 'no-store')

    const { referralId } = req.params as Record<string, string>
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
        // The confirmation page is a "fixed" form: the target status id was
        // committed when the page was rendered and is sent back as a hidden
        // field. We MUST NOT silently substitute the freshly-fetched
        // suggestedStatus here — doing so meant that if the referral state
        // moved on between render and submit (the APG-2383 / M209500 race),
        // we would post the *new* suggested status (e.g. `Programme complete`
        // instead of `On programme`).
        const submittedStatusId = data.paramsForUpdate.referralStatusDescriptionId
        const currentSuggestedId = statusDetails.suggestedStatus.statusDescriptionId
        const isStillValid =
          !!submittedStatusId &&
          (submittedStatusId === currentSuggestedId ||
            statusDetails.availableStatuses.some(s => s.id === submittedStatusId))

        if (!isStillValid) {
          res.status(409)
          formError = singleFieldValidationError('more-details', errorMessages.updateStatus.transitionChanged)
          userInputData = req.body
        } else {
          const updateObject: CreateReferralStatusHistory = {
            referralStatusDescriptionId: submittedStatusId,
            additionalDetails: data.paramsForUpdate.additionalDetails,
          }
          try {
            await sendAuditEvent('EDIT_REFERRAL_STATUS', username, referralDetails?.crn, 'CRN', {
              referralId,
              updatedStatusId: submittedStatusId,
            })
            const response = await this.accreditedProgrammesManageAndDeliverService.updateStatus(
              username,
              referralId,
              updateObject,
            )
            logger.info(
              {
                event: 'UPDATE_REFERRAL_STATUS',
                referralId,
                pdu: referralDetails?.pdu,
                user: username,
                userRegion: req.session.userRegion?.regionDescription ?? '',
              },
              'Referral status updated',
            )
            return res.redirect(`/referral/${referralId}/status-history?message=${response.message}`)
          } catch (error) {
            if (isInvalidTransitionError(error)) {
              res.status(409)
              formError = singleFieldValidationError('more-details', errorMessages.updateStatus.invalidTransition)
              userInputData = req.body
            } else {
              throw error
            }
          }
        }
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
