import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService, {
  DummyData,
} from '../services/accreditedProgrammesManageAndDeliverService'
import TestPagePresenter from './testPagePresenter'
import TestPageView from './testPageView'
import ControllerUtils from '../utils/controllerUtils'

export default class TestPageController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async showTestPage(req: Request, res: Response): Promise<void> {
    const { username } = req.user

    const testItem: DummyData = await this.accreditedProgrammesManageAndDeliverService.getDummy(username)
    const presenter = new TestPagePresenter(testItem)
    const view = new TestPageView(presenter)

    ControllerUtils.renderWithLayout(res, view)
  }
}
