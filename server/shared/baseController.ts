import { ReferralDetails } from '@manage-and-deliver-api'
import { Response } from 'express'
import ControllerUtils from '../utils/controllerUtils'
import { PageContentView } from './routes/layoutView'
import { PrimaryNavigationTab } from './routes/layoutPresenter'

export default abstract class BaseController {
  protected abstract readonly primaryNavigationTab: PrimaryNavigationTab

  protected renderPage(
    res: Response,
    view: PageContentView,
    serviceUser: ReferralDetails | null = null,
    primaryNavigationTab: PrimaryNavigationTab = this.primaryNavigationTab,
  ): void {
    return ControllerUtils.renderWithLayout(res, view, serviceUser, primaryNavigationTab)
  }
}
