import { Request, Response } from 'express'

import { ReferralDetails } from '@manage-and-deliver-api'
import AccreditedProgrammesManageAndDeliverService from '../services/accreditedProgrammesManageAndDeliverService'
import ControllerUtils from '../utils/controllerUtils'
import AlcoholMisusePresenter from './alcoholMisuse/alcoholMisusePresenter'
import AlcoholMisuseView from './alcoholMisuse/alcoholMisuseView'
import AttitudesPresenter from './attitudes/attitudesPresenter'
import AttitudesView from './attitudes/attitudesView'
import DrugMisusePresenter from './drugMisuse/drugMisusePresenter'
import DrugMisuseView from './drugMisuse/drugMisuseView'
import EducationTrainingAndEmploymentPresenter from './educationTrainingAndEmployment/educationTrainingAndEmploymentPresenter'
import EducationTrainingAndEmploymentView from './educationTrainingAndEmployment/educationTrainingAndEmploymentView'
import EmotionalWellbeingPresenter from './emotionalWellbeing/emotionalWellbeingPresenter'
import EmotionalWellbeingView from './emotionalWellbeing/emotionalWellbeingView'
import HealthPresenter from './health/healthPresenter'
import HealthView from './health/healthView'
import LearningAndNeedsPresenter from './learningAndNeeds/learningAndNeedsPresenter'
import LearningAndNeedsView from './learningAndNeeds/learningAndNeedsView'
import LifestyleAndAssociatesPresenter from './lifestyleAndAssociates/lifestyleAndAssociatesPresenter'
import LifestyleAndAssociatesView from './lifestyleAndAssociates/lifestyleAndAssociatesView'
import OffenceAnalysisPresenter from './offenceAnalysis/offenceAnalysisPresenter'
import OffenceAnalysisView from './offenceAnalysis/offenceAnalysisView'
import RisksAndAlertsPresenter from './risksAndAlerts/risksAndAlertsPresenter'
import RisksAndAlertsView from './risksAndAlerts/risksAndAlertsView'
import RisksAndNeedsPresenter from './risksAndNeedsPresenter'
import RisksAndNeedsView from './risksAndNeedsView'
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
    const subNavValue = 'risksAndAlerts'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new RisksAndAlertsPresenter(subNavValue, referralId)
    const view = new RisksAndAlertsView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showLearningNeedsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'learningNeeds'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new LearningAndNeedsPresenter(subNavValue, referralId)
    const view = new LearningAndNeedsView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showOffenceAnalysisPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'offenceAnalysis'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const offenceAnalysis = await this.accreditedProgrammesManageAndDeliverService.getOffenceAnalysis(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new OffenceAnalysisPresenter(subNavValue, referralId, offenceAnalysis)
    const view = new OffenceAnalysisView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showEducationTrainingAndEmploymentPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'educationTrainingAndEmployment'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new EducationTrainingAndEmploymentPresenter(subNavValue, referralId)
    const view = new EducationTrainingAndEmploymentView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showRelationshipsPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'relationships'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new RisksAndNeedsPresenter(subNavValue, referralId)
    const view = new RisksAndNeedsView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showLifestyleAndAssociatesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'lifestyleAndAssociates'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new LifestyleAndAssociatesPresenter(subNavValue, referralId)
    const view = new LifestyleAndAssociatesView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showDrugMisusePage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'drugMisuse'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new DrugMisusePresenter(subNavValue, referralId)
    const view = new DrugMisuseView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAlcoholMisusePage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'alcoholMisuse'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new AlcoholMisusePresenter(subNavValue, referralId)
    const view = new AlcoholMisuseView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showEmotionalWellbeingPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'emotionalWellbeing'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new EmotionalWellbeingPresenter(subNavValue, referralId)
    const view = new EmotionalWellbeingView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showThinkingAndBehavingPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'thinkingAndBehaviour'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new ThinkingAndBehavingPresenter(subNavValue, referralId)
    const view = new ThinkingAndBehavingView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showAttitudesPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'attitudes'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new AttitudesPresenter(subNavValue, referralId)
    const view = new AttitudesView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showHealthPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'health'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)

    const presenter = new HealthPresenter(subNavValue, referralId)
    const view = new HealthView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }

  async showRoshAnalysisPage(req: Request, res: Response): Promise<void> {
    const { referralId } = req.params
    const { username } = req.user
    const subNavValue = 'roshAnalysis'

    const sharedReferralDetailsData = await this.getSharedPageData(referralId, username)
    const roshAnalysis = await this.accreditedProgrammesManageAndDeliverService.getRoshAnalysis(
      username,
      sharedReferralDetailsData.crn,
    )

    const presenter = new RoshAnalysisPresenter(subNavValue, referralId, roshAnalysis)
    const view = new RoshAnalysisView(presenter)

    ControllerUtils.renderWithLayout(res, view, sharedReferralDetailsData)
  }
}
