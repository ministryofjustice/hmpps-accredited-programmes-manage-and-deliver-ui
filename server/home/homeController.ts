import { Request, Response } from 'express'
import HomePresenter from './homePresenter'
import HomeView from './homeView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'

export default class HomeController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Home

  constructor() {
    super()
  }

  async showHomePage(req: Request, res: Response): Promise<void> {
    const presenter = new HomePresenter()
    const view = new HomeView(presenter)

    return this.renderPage(res, view)
  }
}
