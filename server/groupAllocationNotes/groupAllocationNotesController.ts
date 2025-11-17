import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import MotivationBackgroundAndNonAssociationsView from './motivationBackgroundAndNonAssociations/motivationBackgroundAndNonAssociationsView'
import MotivationBackgroundAndNonAssociationsPresenter from './motivationBackgroundAndNonAssociations/motivationBackgroundAndNonAssociationsPresenter'
import AddMotivationBackgroundAndNonAssociationsNotesView from './addMotivationBackgroundAndNonAssociationsNotes/addMotivationBackgroundAndNonAssociationsNotesView'
import AddMotivationBackgroundAndNonAssociationsNotesPresenter from './addMotivationBackgroundAndNonAssociationsNotes/addMotivationBackgroundAndNonAssociationsNotesPresenter'
import { FormValidationError } from '../utils/formValidationError'
import AddMotivationBackgroundAndNonAssociatesForm from './addMotivationBackgroundAndNonAssociationsNotes/addMotivationBackgroundAndNonAssociatesForm'

export default class GroupAllocationNotesController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showMotivationBackgroundAndNonAssociationsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated, isMotivationsUpdated } = req.query

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const motivationBackgroundAndNonAssociations =
      await this.accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations(
        referralId,
        username,
      )

    const presenter = new MotivationBackgroundAndNonAssociationsPresenter(
      referralDetails,
      motivationBackgroundAndNonAssociations,
      'motivationBackgroundAndNonAssociations',
      isCohortUpdated === 'true',
      isLdcUpdated === 'true',
      isMotivationsUpdated === 'true',
    )
    const view = new MotivationBackgroundAndNonAssociationsView(presenter)
    ControllerUtils.renderWithLayout(res, view, referralDetails)
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
        await this.accreditedProgrammesManageAndDeliverService.createOrUpdateReferralMotivationBackgroundAndNonAssociations(
          username,
          referralId,
          data.paramsForUpdate,
        )
        return res.redirect(
          `/referral/${referralId}/group-allocation-notes/motivation-background-and-non-associations?isMotivationsUpdated=true`,
        )
      }
    }

    const referralDetails = await this.accreditedProgrammesManageAndDeliverService.getReferralDetails(
      referralId,
      username,
    )

    const motivationBackgroundAndNonAssociations =
      await this.accreditedProgrammesManageAndDeliverService.getMotivationBackgroundAndNonAssociations(
        referralId,
        username,
      )

    const presenter = new AddMotivationBackgroundAndNonAssociationsNotesPresenter(
      referralDetails,
      motivationBackgroundAndNonAssociations,
      formError,
      userInputData,
    )
    const view = new AddMotivationBackgroundAndNonAssociationsNotesView(presenter)
    return ControllerUtils.renderWithLayout(res, view, referralDetails)
  }
}
