import { Request, Response } from 'express'

import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import CaselistPresenter, { CaselistPageSection } from './caselistPresenter'
import CaselistView from './caselistView'
import CaselistFilter from './caselistFilter'

export default class CaselistController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  private getCaselistData(req: Request): { username: string; queryParamsAsString: string; filter: CaselistFilter } {
    const { username } = req.user
    const filter = CaselistFilter.fromRequest(req)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_url, queryParamsAsString] = req.originalUrl.split('?')

    return { filter, queryParamsAsString, username }
  }

  async showOpenCaselist(req: Request, res: Response): Promise<void> {
    const { filter, queryParamsAsString, username } = this.getCaselistData(req)

    const openCaseList = await this.accreditedProgrammesManageAndDeliverService.getOpenCaselist(username)

    const presenter = new CaselistPresenter(CaselistPageSection.Open, openCaseList, filter, queryParamsAsString)

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }

  async showClosedCaselist(req: Request, res: Response): Promise<void> {
    const { username, filter, queryParamsAsString } = this.getCaselistData(req)

    const closedCaseList = await this.accreditedProgrammesManageAndDeliverService.getClosedCaselist(username)

    const presenter = new CaselistPresenter(CaselistPageSection.Closed, closedCaseList, filter, queryParamsAsString)

    const view = new CaselistView(presenter)

    ControllerUtils.renderWithLayout(res, view, null)
  }
}
