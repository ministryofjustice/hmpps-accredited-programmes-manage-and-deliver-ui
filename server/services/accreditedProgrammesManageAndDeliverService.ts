import {
  Availability,
  CreateAvailability,
  OffenceHistory,
  PersonalDetails,
  ReferralCaseListItem,
  ReferralDetails,
  RoshAnalysis,
  SentenceInformation,
  UpdateAvailability,
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

  async getRoshAnalysis(username: Express.User['username'], crn: string): Promise<RoshAnalysis> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/rosh-analysis`,
      headers: { Accept: 'application/json' },
    })) as RoshAnalysis
  }
}
