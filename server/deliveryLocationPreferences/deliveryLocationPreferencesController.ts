import type { Request, Response } from 'express'
import { IAccreditedProgrammesManageAndDeliverService } from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'

export default class DeliveryLocationPreferencesController {
  constructor(private readonly apiClient: IAccreditedProgrammesManageAndDeliverService) {}

  async showDeliveryLocationPreferencesFormPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user
    const { referralId } = req.params
    await this.apiClient.getDeliveryLocationPreferencesFormData(username, referralId)
    ControllerUtils.renderWithLayout(res)
  }
}
