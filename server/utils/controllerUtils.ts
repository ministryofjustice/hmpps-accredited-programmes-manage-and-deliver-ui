import { ReferralDetails } from '@manage-and-deliver-api'
import { Response } from 'express'
import LayoutPresenter, { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import LayoutView, { PageContentView } from '../shared/routes/layoutView'

export default class ControllerUtils {
  static renderWithLayout(
    res: Response,
    contentView: PageContentView,
    serviceUser: ReferralDetails,
    primaryNavigationTab?: PrimaryNavigationTab,
  ): void {
    const presenter = new LayoutPresenter(serviceUser, primaryNavigationTab)
    const view = new LayoutView(presenter, contentView, res.locals.userLocation)

    res.render(view.renderArgs[0], view.renderArgs[1])
  }
}
