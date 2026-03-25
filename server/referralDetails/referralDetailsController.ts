import { Request, Response } from 'express'

import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import AdditionalInformationPresenter from './additionalInformationPresenter'
import AdditionalInformationView from './additionalInformationView'
import LocationPresenter from './locationPresenter'
import LocationView from './locationView'
import OffenceHistoryPresenter from './offenceHistoryPresenter'
import OffenceHistoryView from './offenceHistoryView'
import PersonalDetailsPresenter from './personalDetailsPresenter'
import PersonalDetailsView from './personalDetailsView'
import ProgrammeHistoryPresenter from './programmeHistoryPresenter'
import ProgrammeHistoryView from './programmeHistoryView'
import SentenceInformationPresenter from './sentenceInformationPresenter'
import SentenceInformationView from './sentenceInformationView'
import StatusHistoryPresenter from './statusHistoryPresenter'
import StatusHistoryView from './statusHistoryView'
import { PrimaryNavigationTab } from '../shared/routes/layoutPresenter'
import BaseController from '../shared/baseController'
import AttendanceHistoryPresenter from './attendanceHistory/attendanceHistoryPresenter'
import AttendanceHistoryView from './attendanceHistory/attendanceHistoryView'

export default class ReferralDetailsController extends BaseController {
  protected readonly primaryNavigationTab = PrimaryNavigationTab.Caselist

  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {
    super()
  }

  async showReferralDetailsPage(id: string, username: string): Promise<ReferralDetails> {
    return this.accreditedProgrammesManageAndDeliverService.getReferralDetails(id, username)
  }

  async showPersonalDetailsPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { isCohortUpdated, isLdcUpdated } = req.query
    const { username } = req.user
    const subNavValue = 'personalDetails'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const personalDetails = await this.accreditedProgrammesManageAndDeliverService.getPersonalDetails(id, username)

    const presenter = new PersonalDetailsPresenter(
      sharedReferralDetailsData,
      subNavValue,
      personalDetails,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new PersonalDetailsView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showProgrammeHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'programmeHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new ProgrammeHistoryPresenter(
      sharedReferralDetailsData,
      subNavValue,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new ProgrammeHistoryView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showOffenceHistoryPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'offenceHistory'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const offenceHistory = await this.accreditedProgrammesManageAndDeliverService.getOffenceHistory(username, id)

    const presenter = new OffenceHistoryPresenter(
      sharedReferralDetailsData,
      subNavValue,
      offenceHistory,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new OffenceHistoryView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showSentenceInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'sentenceInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)
    const sentenceInformation = await this.accreditedProgrammesManageAndDeliverService.getSentenceInformation(
      username,
      id,
    )

    const presenter = new SentenceInformationPresenter(
      sharedReferralDetailsData,
      subNavValue,
      sentenceInformation,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new SentenceInformationView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showLocationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated, preferredLocationUpdated } = req.query
    const subNavValue = 'location'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const deliveryLocationPreferences =
      await this.accreditedProgrammesManageAndDeliverService.getDeliveryLocationPreferences(username, id)

    const presenter = new LocationPresenter(
      sharedReferralDetailsData,
      subNavValue,
      deliveryLocationPreferences,
      preferredLocationUpdated === 'true',
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new LocationView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showAdditionalInformationPage(req: Request, res: Response): Promise<void> {
    const { id } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'additionalInformation'

    const sharedReferralDetailsData = await this.showReferralDetailsPage(id, username)

    const presenter = new AdditionalInformationPresenter(
      sharedReferralDetailsData,
      subNavValue,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AdditionalInformationView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showStatusHistoryPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { message, isCohortUpdated, isLdcUpdated } = req.query

    const sharedReferralDetailsData = await this.showReferralDetailsPage(referralId, username)
    const statusHistory = await this.accreditedProgrammesManageAndDeliverService.getStatusHistory(username, referralId)

    const successMessage = message ? String(message) : null

    const presenter = new StatusHistoryPresenter(
      referralId,
      statusHistory,
      sharedReferralDetailsData,
      successMessage,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new StatusHistoryView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }

  async showAttendanceHistoryPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { message, isCohortUpdated, isLdcUpdated } = req.query

    const sharedReferralDetailsData = await this.showReferralDetailsPage(referralId, username)

    const attendanceHistory = await this.accreditedProgrammesManageAndDeliverService.getAttendanceHistory(
      username,
      referralId,
    )

    const successMessage = message ? String(message) : null

    const presenter = new AttendanceHistoryPresenter(
      referralId,
      attendanceHistory,
      sharedReferralDetailsData,
      successMessage,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AttendanceHistoryView(presenter)

    req.session.originPage = req.path

    return this.renderPage(res, view, sharedReferralDetailsData)
  }
}
