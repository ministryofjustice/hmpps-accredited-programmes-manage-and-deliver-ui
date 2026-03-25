import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService from '../../services/accreditedProgrammesManageAndDeliverService'
import { FormValidationError } from '../../utils/formValidationError'
import { PrimaryNavigationTab } from '../../shared/routes/layoutPresenter'
import BaseController from '../../shared/baseController'
import AddAvailabilityForm from './AddAvailabilityForm'
import AddAvailabilityPresenter from './addAvailabilityPresenter'
import AddAvailabilityView from './addAvailabilityView'

export default class AddAvailabilityController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async updateAvailability(req: Request, res: Response): Promise<void> {
    const { availabilityId } = req.params
    await this.showAddAvailabilityPage(req, res, availabilityId)
  }

  async showAddAvailabilityPage(req: Request, res: Response, availabilityId: string = null): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    let formError: FormValidationError | null = null
    let userInputData = null
    if (req.method === 'POST') {
      const data = await new AddAvailabilityForm(req, referralId).data()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        if (availabilityId) {
          await this.accreditedProgrammesManageAndDeliverService.updateAvailability(username, {
            ...data.paramsForUpdate,
            availabilityId,
          })
        } else {
          await this.accreditedProgrammesManageAndDeliverService.addAvailability(username, data.paramsForUpdate)
        }
        return res.redirect(`/referral/${referralId}/availability-and-motivation/availability?detailsUpdated=true`)
      }
    }

    const availability = await this.accreditedProgrammesManageAndDeliverService.getAvailability(username, referralId)

    const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(
      referralId,
      username,
    )

    const presenter = new AddAvailabilityPresenter(
      personalDetails,
      req.session.originPage,
      availability,
      formError,
      userInputData,
      referralId,
    )
    const view = new AddAvailabilityView(presenter)

    return this.renderPage(res, view, referralDetails)
  }
}
