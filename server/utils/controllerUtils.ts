import { Response } from 'express'
import LayoutPresenter from '../shared/routes/layoutPresenter'
import LayoutView, { PageContentView } from '../shared/routes/layoutView'

export default class ControllerUtils {
  static renderWithLayout(
    res: Response,
    contentView: PageContentView,
    serviceUser: { name: { forename: string; surname: string }; dateOfBirth: string; crn: string } | null,
  ): void {
    const presenter = new LayoutPresenter(serviceUser)
    const view = new LayoutView(presenter, contentView)

    res.render(view.renderArgs[0], view.renderArgs[1])
  }
}
