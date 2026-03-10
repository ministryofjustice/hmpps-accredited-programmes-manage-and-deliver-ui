import { Request, Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import HomePresenter from './homePresenter'
import HomeView from './homeView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'

export default class HomeController {
  constructor() {}

  async showHomePage(req: Request, res: Response): Promise<void> {
    const presenter = new HomePresenter()
    const view = new HomeView(presenter)

    return ControllerUtils.renderWithLayout(res, view, null, PrimaryNavigationTab.Home)
  }
}
