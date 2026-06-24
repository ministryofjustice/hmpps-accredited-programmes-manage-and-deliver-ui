import { Request, Response } from 'express'
import HomePresenter from './homePresenter'
import HomeView from './homeView'
import { isRegionAllowed } from './allowedRegions'
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

    if(!isRegionAllowed(req.session.userRegion?.regionCode)) {
      res.status(401)
      return res.render('invalidregion')
    }

    return this.renderPage(res, view)
  }
}
