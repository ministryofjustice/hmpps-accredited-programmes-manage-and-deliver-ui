import { Request, Response } from 'express'
import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import MotivationBackgroundAndNonAssociationsView from './motivationBackgroundAndNonAssociations/motivationBackgroundAndNonAssociationsView'
import MotivationBackgroundAndNonAssociationsPresenter from './motivationBackgroundAndNonAssociations/motivationBackgroundAndNonAssociationsPresenter'
import AddMotivationBackgroundAndNonAssociationsNotesView from './addMotivationBackgroundAndNonAssociationsNotes/addMotivationBackgroundAndNonAssociationsNotesView'
import AddMotivationBackgroundAndNonAssociationsNotesPresenter from './addMotivationBackgroundAndNonAssociationsNotes/addMotivationBackgroundAndNonAssociationsNotesPresenter'
import { FormValidationError } from '../utils/formValidationError'
import AddMotivationBackgroundAndNonAssociatesForm from './addMotivationBackgroundAndNonAssociationsNotes/addMotivationBackgroundAndNonAssociatesForm'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'
import AvailabilityPresenter from './availability/availabilityPresenter'
import AvailabilityView from './availability/availabilityView'

export default class AvailabilityAndMotivationController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async getReferralDetails(id: string, username: string): Promise<ReferralDetails> {
    return this.accreditedProgrammesManageAndDeliverService.getReferralDetails(id, username)
  }

  async showMotivationBackgroundAndNonAssociationsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated, isMotivationsUpdated } = req.query

    const referralDetailsData = await this.getReferralDetails(referralId, username)

    const motivationBackgroundAndNonAssociations =
      await this.accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations(
        username,
        referralId,
      )

    const presenter = new MotivationBackgroundAndNonAssociationsPresenter(
      referralDetailsData,
      motivationBackgroundAndNonAssociations,
      'motivationBackgroundAndNonAssociations',
      isCohortUpdated === 'true',
      isLdcUpdated === 'true',
      isMotivationsUpdated === 'true',
    )
    const view = new MotivationBackgroundAndNonAssociationsView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, referralDetailsData)
  }

  async showAddMotivationBackgroundAndNonAssociationsNotesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    let formError: FormValidationError | null = null
    let userInputData = null

    if (req.method === 'POST') {
      const data = await new AddMotivationBackgroundAndNonAssociatesForm(
        req,
      ).addMotivationBackgroundAndNonAssociatesData()

      if (data.error) {
        res.status(400)
        formError = data.error
        userInputData = req.body
      } else {
        if (
          data.paramsForUpdate === null ||
          Object.values(data.paramsForUpdate).every(value => value === null || value === '')
        ) {
          return res.redirect(`/referral/${referralId}/motivation-background-and-non-associations`)
        }

        await this.accreditedProgrammesManageAndDeliverService.createOrUpdateReferralMotivationBackgroundAndNonAssociations(
          username,
          referralId,
          data.paramsForUpdate,
        )
        return res.redirect(
          `/referral/${referralId}/motivation-background-and-non-associations?isMotivationsUpdated=true`,
        )
      }
    }

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const motivationBackgroundAndNonAssociations =
      await this.accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations(
        username,
        referralId,
      )

    const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
      referralDetails,
      motivationBackgroundAndNonAssociations,
      formError,
      userInputData,
    )
    const view = new AddMotivationBackgroundAndNonAssociationsNotesView(presenter)
    return this.renderPage(res, view, referralDetails)
  }

  async showAvailabilityPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated, detailsUpdated } = req.query
    const subNavValue = 'availability'

    const referralDetailsData = await this.getReferralDetails(id, username)

    const availability = await this.accreditedProgrammesManageAndDeliverService.getAvailability(username, id)

    const presenter = new AvailabilityPresenter(
      referralDetailsData,
      subNavValue,
      availability,
      detailsUpdated === 'true',
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AvailabilityView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, referralDetailsData)
  }
}
