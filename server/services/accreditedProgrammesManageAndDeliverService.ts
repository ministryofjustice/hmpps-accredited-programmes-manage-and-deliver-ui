import {
  Availability,
  CreateAvailability,
  OffenceAnalysis,
  OffenceHistory,
  PersonalDetails,
  PniScore,
  ReferralCaseListItem,
  ReferralDetails,
  RoshAnalysis,
  SentenceInformation,
  LearningNeeds,
  UpdateAvailability,
  Health,
  LifestyleAndAssociates,
  Relationships,
  AlcoholMisuseDetails,
  DrugDetails,
  EmotionalWellbeing,
  ThinkingAndBehaviour,
  Attitude,
  Risks,
} from '@manage-and-deliver-api'
import { CaselistFilterParams } from '../caselist/CaseListFilterParams'
import config, { ApiConfig } from '../config'
import type { HmppsAuthClient, RestClientBuilderWithoutToken } from '../data'
import RestClient from '../data/restClient'
import { Page } from '../shared/models/pagination'

export interface PaginationParams {
  // Page number to retrieve -- starts from 1
  page?: number
  // Number of elements in a page
  size?: number
  // Sort by property, defaults to ascending order. If descending is required then add ',DESC' at the end of the property you want sorted i.e. ['$PROPERTY_NAME,DESC']
  sort?: string[]
}

export default class AccreditedProgrammesManageAndDeliverService {
  constructor(private readonly hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient>) {}

  async createRestClientFromUsername(username: Express.User['username']): Promise<RestClient> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)

    return new RestClient(
      'Accredited Programmes Manage And Deliver Service API Client',
      config.apis.accreditedProgrammesManageAndDeliverService as ApiConfig,
      systemToken,
    )
  }

  async getOpenCaselist(
    username: Express.User['username'],
    paginationParams: PaginationParams,
    filter: CaselistFilterParams,
  ): Promise<Page<ReferralCaseListItem>> {
    const restClient = await this.createRestClientFromUsername(username)
    const filterQuery: Record<string, unknown> = { ...filter }
    return (await restClient.get({
      path: `/pages/caselist/open`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filterQuery },
    })) as Page<ReferralCaseListItem>
  }

  async getClosedCaselist(
    username: Express.User['username'],
    paginationParams: PaginationParams,
    filter: CaselistFilterParams,
  ): Promise<Page<ReferralCaseListItem>> {
    const restClient = await this.createRestClientFromUsername(username)
    const filterQuery: Record<string, unknown> = { ...filter }
    return (await restClient.get({
      path: `/pages/caselist/closed`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filterQuery },
    })) as Page<ReferralCaseListItem>
  }

  async getReferralDetails(referralId: string, username: Express.User['username']): Promise<ReferralDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as ReferralDetails
  }

  async getPersonalDetails(referralId: string, username: Express.User['username']): Promise<PersonalDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/personal-details`,
      headers: { Accept: 'application/json' },
    })) as PersonalDetails
  }

  async getAvailability(username: Express.User['username'], referralId: string): Promise<Availability> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/availability/referral/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as Availability
  }

  async getSentenceInformation(username: Express.User['username'], referralId: string): Promise<SentenceInformation> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/sentence-information`,
      headers: { Accept: 'application/json' },
    })) as SentenceInformation
  }

  async getRisksAndAlerts(username: Express.User['username'], crn: string): Promise<Risks> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/risks-and-alerts`,
      headers: { Accept: 'application/json' },
    })) as Risks
  }

  async getLearningNeeds(username: Express.User['username'], crn: string): Promise<LearningNeeds> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/learning-needs`,
      headers: { Accept: 'application/json' },
    })) as LearningNeeds
  }

  async getLifestyleAndAssociates(username: Express.User['username'], crn: string): Promise<LifestyleAndAssociates> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/lifestyle-and-associates`,
      headers: { Accept: 'application/json' },
    })) as LifestyleAndAssociates
  }

  async getRelationships(username: Express.User['username'], crn: string): Promise<Relationships> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/relationships`,
      headers: { Accept: 'application/json' },
    })) as Relationships
  }

  async getAlcoholMisuseDetails(username: Express.User['username'], crn: string): Promise<AlcoholMisuseDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/alcohol-misuse-details`,
      headers: { Accept: 'application/json' },
    })) as AlcoholMisuseDetails
  }

  async getAttitudes(username: Express.User['username'], crn: string): Promise<Attitude> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/attitude`,
      headers: { Accept: 'application/json' },
    })) as Attitude
  }

  async getHealth(username: Express.User['username'], crn: string): Promise<Health> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/health`,
      headers: { Accept: 'application/json' },
    })) as Health
  }

  async getDrugDetails(username: Express.User['username'], crn: string): Promise<DrugDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/drug-details`,
      headers: { Accept: 'application/json' },
    })) as DrugDetails
  }

  async getEmotionalWellbeing(username: Express.User['username'], crn: string): Promise<DrugDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/emotional-wellbeing`,
      headers: { Accept: 'application/json' },
    })) as EmotionalWellbeing
  }

  async getThinkingAndBehaviour(username: Express.User['username'], crn: string): Promise<ThinkingAndBehaviour> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/thinking-and-behaviour`,
      headers: { Accept: 'application/json' },
    })) as ThinkingAndBehaviour
  }

  async addAvailability(
    username: Express.User['username'],
    createAvailabilityParams: CreateAvailability,
  ): Promise<Availability> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.post({
      path: `/availability`,
      headers: { Accept: 'application/json' },
      data: createAvailabilityParams,
    })) as Availability
  }

  async updateAvailability(
    username: Express.User['username'],
    updateAvailabilityParams: UpdateAvailability,
  ): Promise<Availability> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.put({
      path: `/availability`,
      headers: { Accept: 'application/json' },
      data: updateAvailabilityParams,
    })) as Availability
  }

  async getOffenceHistory(username: Express.User['username'], referralId: string): Promise<OffenceHistory> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/offence-history`,
      headers: { Accept: 'application/json' },
    })) as OffenceHistory
  }

  async getPniScore(username: Express.User['username'], crn: string): Promise<PniScore> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/pni-score/${crn}`,
      headers: { Accept: 'application/json' },
    })) as PniScore
  }

  async getRoshAnalysis(username: Express.User['username'], crn: string): Promise<RoshAnalysis> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/rosh-analysis`,
      headers: { Accept: 'application/json' },
    })) as RoshAnalysis
  }

  async getOffenceAnalysis(username: Express.User['username'], crn: string): Promise<OffenceAnalysis> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/offence-analysis`,
      headers: { Accept: 'application/json' },
    })) as OffenceAnalysis
  }
}
