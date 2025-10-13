import { Request, Response } from 'express'

import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import AlcoholMisusePresenter from './alcoholMisuse/alcoholMisusePresenter'
import AlcoholMisuseView from './alcoholMisuse/alcoholMisuseView'
import AttitudesPresenter from './attitudes/attitudesPresenter'
import AttitudesView from './attitudes/attitudesView'
import DrugDetailsPresenter from './drugMisuse/drugDetailsPresenter'
import DrugDetailsView from './drugMisuse/drugDetailsView'
import EmotionalWellbeingPresenter from './emotionalWellbeing/emotionalWellbeingPresenter'
import EmotionalWellbeingView from './emotionalWellbeing/emotionalWellbeingView'
import HealthPresenter from './health/healthPresenter'
import HealthView from './health/healthView'
import LearningNeedsPresenter from './learningNeeds/learningNeedsPresenter'
import LearningNeedsView from './learningNeeds/learningNeedsView'
import LifestyleAndAssociatesPresenter from './lifestyleAndAssociates/lifestyleAndAssociatesPresenter'
import LifestyleAndAssociatesView from './lifestyleAndAssociates/lifestyleAndAssociatesView'
import OffenceAnalysisPresenter from './offenceAnalysis/offenceAnalysisPresenter'
import OffenceAnalysisView from './offenceAnalysis/offenceAnalysisView'
import RelationshipsPresenter from './relationships/relationshipsPresenter'
import RelationshipsView from './relationships/relationshipsView'
import RisksAndAlertsPresenter from './risksAndAlerts/risksAndAlertsPresenter'
import RisksAndAlertsView from './risksAndAlerts/risksAndAlertsView'
import RoshAnalysisPresenter from './roshAnalysis/roshAnalysisPresenter'
import RoshAnalysisView from './roshAnalysis/roshAnalysisView'
import ThinkingAndBehavingPresenter from './thinkingAndBehaving/thinkingAndBehavingPresenter'
import ThinkingAndBehavingView from './thinkingAndBehaving/thinkingAndBehavingView'

export default class RisksAndNeedsController {
  constructor(
    private readonly accreditedProgrammesManageAndDeliverService: AccreditedProgrammesManageAndDeliverService,
  ) {}

  async getSharedPageData(id: string, username: string): Promise<ReferralDetails> {
    return this.accreditedProgrammesManageAndDeliverService.getReferralDetails(id, username)
  }

  async showRisksAndAlertsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'risksAndAlerts'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const risks = await this.accreditedProgrammesManageAndDeliverService.getRisksAndAlerts(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new RisksAndAlertsPresenter(
      subNavValue,
      sharedReferralDetailsData,
      risks,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new RisksAndAlertsView(presenter)

    req.session.originPage = req.path

    return ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showLearningNeedsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'learningNeeds'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const learningNeeds = await this.accreditedProgrammesManageAndDeliverService.getLearningNeeds(
      username,
      sharedReferralDetailsData.crn,
    )
    const presenter = new LearningNeedsPresenter(
      subNavValue,
      sharedReferralDetailsData,
      learningNeeds,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new LearningNeedsView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showOffenceAnalysisPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'offenceAnalysis'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const offenceAnalysis = await this.accreditedProgrammesManageAndDeliverService.getOffenceAnalysis(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new OffenceAnalysisPresenter(
      subNavValue,
      sharedReferralDetailsData,
      offenceAnalysis,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new OffenceAnalysisView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showRelationshipsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'relationships'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const relationships = await this.accreditedProgrammesManageAndDeliverService.getRelationships(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new RelationshipsPresenter(
      subNavValue,
      sharedReferralDetailsData,
      relationships,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new RelationshipsView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showLifestyleAndAssociatesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'lifestyleAndAssociates'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const lifestyleAndAssociates = await this.accreditedProgrammesManageAndDeliverService.getLifestyleAndAssociates(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new LifestyleAndAssociatesPresenter(
      subNavValue,
      sharedReferralDetailsData,
      lifestyleAndAssociates,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new LifestyleAndAssociatesView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAlcoholMisusePage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'alcoholMisuse'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const alcoholMisuseDetails = await this.accreditedProgrammesManageAndDeliverService.getAlcoholMisuseDetails(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new AlcoholMisusePresenter(
      subNavValue,
      sharedReferralDetailsData,
      alcoholMisuseDetails,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AlcoholMisuseView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showEmotionalWellbeingPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'emotionalWellbeing'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const emotionalWellbeing = await this.accreditedProgrammesManageAndDeliverService.getEmotionalWellbeing(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new EmotionalWellbeingPresenter(
      subNavValue,
      sharedReferralDetailsData,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
      emotionalWellbeing,
    )
    const view = new EmotionalWellbeingView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showThinkingAndBehavingPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'thinkingAndBehaviour'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const thinkingAndBehaviour = await this.accreditedProgrammesManageAndDeliverService.getThinkingAndBehaviour(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new ThinkingAndBehavingPresenter(
      subNavValue,
      sharedReferralDetailsData,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
      thinkingAndBehaviour,
    )
    const view = new ThinkingAndBehavingView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAttitudesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'attitudes'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const attitudes = await this.accreditedProgrammesManageAndDeliverService.getAttitudes(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new AttitudesPresenter(
      subNavValue,
      sharedReferralDetailsData,
      attitudes,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new AttitudesView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showHealthPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'health'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const health = await this.accreditedProgrammesManageAndDeliverService.getHealth(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new HealthPresenter(
      subNavValue,
      sharedReferralDetailsData,
      health,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new HealthView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showDrugDetailsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'drugMisuse'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const drugDetails = await this.accreditedProgrammesManageAndDeliverService.getDrugDetails(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new DrugDetailsPresenter(
      subNavValue,
      sharedReferralDetailsData,
      drugDetails,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new DrugDetailsView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showRoshAnalysisPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const { isCohortUpdated, isLdcUpdated } = req.query
    const subNavValue = 'roshAnalysis'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const roshAnalysis = await this.accreditedProgrammesManageAndDeliverService.getRoshAnalysis(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new RoshAnalysisPresenter(
      subNavValue,
      sharedReferralDetailsData,
      roshAnalysis,
      isLdcUpdated === 'true',
      isCohortUpdated === 'true',
    )
    const view = new RoshAnalysisView(presenter)

    req.session.originPage = req.path

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }
}
