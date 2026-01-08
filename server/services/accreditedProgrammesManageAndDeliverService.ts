import {
  AlcoholMisuseDetails,
  AllocateToGroupRequest,
  AllocateToGroupResponse,
  Attitude,
  Availability,
  CaseListFilterValues,
  CaseListReferrals,
  CodeDescription,
  CohortEnum,
  CreateAvailability,
  CreateDeliveryLocationPreferences,
  CreateGroupRequest,
  CreateOrUpdateReferralMotivationBackgroundAndNonAssociations,
  CreateReferralStatusHistory,
  DeliveryLocationPreferences,
  DeliveryLocationPreferencesFormData,
  DrugDetails,
  EmotionalWellbeing,
  Group,
  GroupsByRegion,
  Health,
  LearningNeeds,
  LifestyleAndAssociates,
  OffenceAnalysis,
  OffenceHistory,
  PersonalDetails,
  PniScore,
  ProgrammeGroupDetails,
  ProgrammeGroupEntity,
  ReferralDetails,
  ReferralMotivationBackgroundAndNonAssociations,
  ReferralStatusHistory,
  ReferralStatusTransitions,
  Relationships,
  RemoveFromGroupRequest,
  RemoveFromGroupResponse,
  Risks,
  RoshAnalysis,
  SentenceInformation,
  SessionScheduleRequest,
  SessionScheduleResponse,
  SessionSchedule,
  SessionAttendance,
  ThinkingAndBehaviour,
  UpdateAvailability,
  UserTeamMember,
} from '@manage-and-deliver-api'
import { CaselistFilterParams } from '../caselist/CaseListFilterParams'
import config, { ApiConfig } from '../config'
import type { HmppsAuthClient, RestClientBuilderWithoutToken } from '../data'
import RestClient from '../data/restClient'
import { GroupListFilterParams } from '../groupDetails/groupListFilterParams'
import type { ExpressUsername } from '../shared/ExpressUsername'

export interface PaginationParams {
  // Page number to retrieve -- starts from 1
  page?: number
  // Number of elements in a page
  size?: number
  // Sort by property, defaults to ascending order. If descending is required then add ',DESC' at the end of the property you want sorted i.e. ['$PROPERTY_NAME,DESC']
  sort?: string[]
}

export interface IAccreditedProgrammesManageAndDeliverService {
  getPossibleDeliveryLocationsForReferral(
    username: ExpressUsername,
    referralId: string,
  ): Promise<DeliveryLocationPreferencesFormData>
}
export default class AccreditedProgrammesManageAndDeliverService
  implements IAccreditedProgrammesManageAndDeliverService
{
  constructor(private readonly hmppsAuthClientBuilder: RestClientBuilderWithoutToken<HmppsAuthClient>) {}

  async createRestClientFromUsername(username: ExpressUsername): Promise<RestClient> {
    const hmppsAuthClient = this.hmppsAuthClientBuilder()
    const systemToken = await hmppsAuthClient.getSystemClientToken(username)

    return new RestClient(
      'Accredited Programmes Manage And Deliver Service API Client',
      config.apis.accreditedProgrammesManageAndDeliverService as ApiConfig,
      systemToken,
    )
  }

  async getOpenCaselist(
    username: ExpressUsername,
    paginationParams: PaginationParams,
    filter: CaselistFilterParams,
  ): Promise<CaseListReferrals> {
    const restClient = await this.createRestClientFromUsername(username)
    const filterQuery: Record<string, unknown> = { ...filter }

    return (await restClient.get({
      path: `/pages/caselist/open`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filterQuery },
    })) as CaseListReferrals
  }

  async getGroupList(
    username: ExpressUsername,
    paginationParams: PaginationParams,
    filter: GroupListFilterParams,
    selectedTab: string,
  ): Promise<GroupsByRegion> {
    const restClient = await this.createRestClientFromUsername(username)

    return (await restClient.get({
      path: `/bff/groups/${selectedTab}`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filter },
    })) as GroupsByRegion
  }

  async getClosedCaselist(
    username: ExpressUsername,
    paginationParams: PaginationParams,
    filter: CaselistFilterParams,
  ): Promise<CaseListReferrals> {
    const restClient = await this.createRestClientFromUsername(username)
    const filterQuery: Record<string, unknown> = { ...filter }
    return (await restClient.get({
      path: `/pages/caselist/closed`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filterQuery },
    })) as CaseListReferrals
  }

  async getGroupAllocatedMembers(
    username: ExpressUsername,
    groupId: string,
    paginationParams: PaginationParams,
    filter: GroupListFilterParams,
  ): Promise<ProgrammeGroupDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    const filterQuery: Record<string, unknown> = { ...filter }
    return (await restClient.get({
      path: `/bff/group/${groupId}/ALLOCATED`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filterQuery },
    })) as ProgrammeGroupDetails
  }

  async getGroupWaitlistMembers(
    username: ExpressUsername,
    groupId: string,
    paginationParams: PaginationParams,
    filter: GroupListFilterParams,
  ): Promise<ProgrammeGroupDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    const filterQuery: Record<string, unknown> = { ...filter }
    return (await restClient.get({
      path: `/bff/group/${groupId}/WAITLIST`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filterQuery },
    })) as ProgrammeGroupDetails
  }

  async getCaseListFilters(username: ExpressUsername): Promise<CaseListFilterValues> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/caselist/filters`,
      headers: { Accept: 'application/json' },
    })) as CaseListFilterValues
  }

  async getReferralDetails(referralId: string, username: Express.User['username']): Promise<ReferralDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as ReferralDetails
  }

  async getPersonalDetails(referralId: string, username: ExpressUsername): Promise<PersonalDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/personal-details`,
      headers: { Accept: 'application/json' },
    })) as PersonalDetails
  }

  async getAvailability(username: ExpressUsername, referralId: string): Promise<Availability> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/availability/referral/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as Availability
  }

  async getSentenceInformation(username: ExpressUsername, referralId: string): Promise<SentenceInformation> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/sentence-information`,
      headers: { Accept: 'application/json' },
    })) as SentenceInformation
  }

  async getRisksAndAlerts(username: ExpressUsername, crn: string): Promise<Risks> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/risks-and-alerts`,
      headers: { Accept: 'application/json' },
    })) as Risks
  }

  async getLearningNeeds(username: ExpressUsername, crn: string): Promise<LearningNeeds> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/learning-needs`,
      headers: { Accept: 'application/json' },
    })) as LearningNeeds
  }

  async getLifestyleAndAssociates(username: ExpressUsername, crn: string): Promise<LifestyleAndAssociates> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/lifestyle-and-associates`,
      headers: { Accept: 'application/json' },
    })) as LifestyleAndAssociates
  }

  async getRelationships(username: ExpressUsername, crn: string): Promise<Relationships> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/relationships`,
      headers: { Accept: 'application/json' },
    })) as Relationships
  }

  async getAlcoholMisuseDetails(username: ExpressUsername, crn: string): Promise<AlcoholMisuseDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/alcohol-misuse-details`,
      headers: { Accept: 'application/json' },
    })) as AlcoholMisuseDetails
  }

  async getAttitudes(username: ExpressUsername, crn: string): Promise<Attitude> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/attitude`,
      headers: { Accept: 'application/json' },
    })) as Attitude
  }

  async getHealth(username: ExpressUsername, crn: string): Promise<Health> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/health`,
      headers: { Accept: 'application/json' },
    })) as Health
  }

  async getDrugDetails(username: ExpressUsername, crn: string): Promise<DrugDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/drug-details`,
      headers: { Accept: 'application/json' },
    })) as DrugDetails
  }

  async getEmotionalWellbeing(username: ExpressUsername, crn: string): Promise<DrugDetails> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/emotional-wellbeing`,
      headers: { Accept: 'application/json' },
    })) as EmotionalWellbeing
  }

  async getThinkingAndBehaviour(username: ExpressUsername, crn: string): Promise<ThinkingAndBehaviour> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/thinking-and-behaviour`,
      headers: { Accept: 'application/json' },
    })) as ThinkingAndBehaviour
  }

  async getsessionScheduleList(
    username: ExpressUsername,
    groupId: string,
    moduleId: string,
    paginationParams: PaginationParams,
    filter: GroupListFilterParams,
  ): Promise<SessionScheduleResponse> {
    const restClient = await this.createRestClientFromUsername(username)

    return (await restClient.get({
      path: `/bff/group/${groupId}/module/${moduleId}/schedule-session-type`,
      headers: { Accept: 'application/json' },
      query: { ...paginationParams, ...filter },
    })) as SessionScheduleResponse
  }

  async addAvailability(
    username: ExpressUsername,
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
    username: ExpressUsername,
    updateAvailabilityParams: UpdateAvailability,
  ): Promise<Availability> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.put({
      path: `/availability`,
      headers: { Accept: 'application/json' },
      data: updateAvailabilityParams,
    })) as Availability
  }

  async getOffenceHistory(username: ExpressUsername, referralId: string): Promise<OffenceHistory> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/offence-history`,
      headers: { Accept: 'application/json' },
    })) as OffenceHistory
  }

  async getStatusHistory(username: ExpressUsername, referralId: string): Promise<ReferralStatusHistory[]> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral/${referralId}/status-history`,
      headers: { Accept: 'application/json' },
    })) as ReferralStatusHistory[]
  }

  async getPniScore(username: ExpressUsername, crn: string): Promise<PniScore> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/pni-score/${crn}`,
      headers: { Accept: 'application/json' },
    })) as PniScore
  }

  async getRoshAnalysis(username: ExpressUsername, crn: string): Promise<RoshAnalysis> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/rosh-analysis`,
      headers: { Accept: 'application/json' },
    })) as RoshAnalysis
  }

  async getOffenceAnalysis(username: ExpressUsername, crn: string): Promise<OffenceAnalysis> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/risks-and-needs/${crn}/offence-analysis`,
      headers: { Accept: 'application/json' },
    })) as OffenceAnalysis
  }

  async getPossibleDeliveryLocationsForReferral(
    username: ExpressUsername,
    referralId: string,
  ): Promise<DeliveryLocationPreferencesFormData> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/referral-delivery-location-preferences-form/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as DeliveryLocationPreferencesFormData
  }

  async createDeliveryLocationPreferences(
    username: Express.User['username'],
    referralId: string,
    createDeliveryLocationPreferences: CreateDeliveryLocationPreferences,
  ): Promise<CreateDeliveryLocationPreferences> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.post({
      path: `/delivery-location-preferences/referral/${referralId}`,
      headers: { Accept: 'application/json' },
      data: createDeliveryLocationPreferences,
    })) as CreateDeliveryLocationPreferences
  }

  async getDeliveryLocationPreferences(
    username: Express.User['username'],
    referralId: string,
  ): Promise<DeliveryLocationPreferences> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral-details/${referralId}/delivery-location-preferences`,
      headers: { Accept: 'application/json' },
    })) as DeliveryLocationPreferences
  }

  async updateDeliveryLocationPreferences(
    username: Express.User['username'],
    referralId: string,
    createDeliveryLocationPreferences: CreateDeliveryLocationPreferences,
  ): Promise<CreateDeliveryLocationPreferences> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.put({
      path: `/delivery-location-preferences/referral/${referralId}`,
      headers: { Accept: 'application/json' },
      data: createDeliveryLocationPreferences,
    })) as CreateDeliveryLocationPreferences
  }

  async createOrUpdateReferralMotivationBackgroundAndNonAssociations(
    username: Express.User['username'],
    referralId: string,
    createOrUpdate: CreateOrUpdateReferralMotivationBackgroundAndNonAssociations,
  ): Promise<ReferralMotivationBackgroundAndNonAssociations> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.put({
      path: `/referral/${referralId}/motivation-background-non-associations`,
      headers: { Accept: 'application/json' },
      data: createOrUpdate,
    })) as ReferralMotivationBackgroundAndNonAssociations
  }

  async getMotivationBackgroundAndNonAssociations(
    username: Express.User['username'],
    referralId: string,
  ): Promise<ReferralMotivationBackgroundAndNonAssociations> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/referral/${referralId}/motivation-background-non-associations`,
      headers: { Accept: 'application/json' },
    })) as ReferralMotivationBackgroundAndNonAssociations
  }

  async updateCohort(username: string, referralId: string, updateCohort: string) {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.put({
      path: `/referral/${referralId}/update-cohort`,
      headers: { Accept: 'application/json' },
      data: { cohort: updateCohort as CohortEnum },
    })) as ReferralDetails
  }

  async updateLdc(username: string, referralId: string, hasLdc: boolean) {
    const restClient = await this.createRestClientFromUsername(username)
    return restClient.post({
      path: `/referral/${referralId}/update-ldc`,
      headers: { Accept: 'application/json' },
      data: { hasLdc },
    })
  }

  async getStatusDetails(referralId: string, username: Express.User['username']): Promise<ReferralStatusTransitions> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/status-transitions/referral/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as ReferralStatusTransitions
  }

  async updateStatus(username: string, referralId: string, updatedStatus: CreateReferralStatusHistory) {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.post({
      path: `/referral/${referralId}/status-history`,
      headers: { Accept: 'application/json' },
      data: updatedStatus,
    })) as { referralStatusHistory: ReferralStatusHistory; message: string }
  }

  async addToGroup(
    username: string,
    referralId: string,
    groupId: string,
    additionalDetails?: string,
  ): Promise<AllocateToGroupResponse> {
    const restClient = await this.createRestClientFromUsername(username)
    const data: AllocateToGroupRequest = { additionalDetails }
    return restClient.post({
      path: `/group/${groupId}/allocate/${referralId}`,
      headers: { Accept: 'application/json' },
      data,
    })
  }

  async createGroup(username: Express.User['username'], data: CreateGroupRequest): Promise<AllocateToGroupResponse> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.post({
      path: `/group`,
      headers: { Accept: 'application/json' },
      data,
    })) as ProgrammeGroupEntity
  }

  async getGroupByCodeInRegion(username: Express.User['username'], groupCode: string): Promise<Group | null> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/group/${groupCode}/details`,
      headers: { Accept: 'application/json' },
    })) as Group | null
  }

  async removeFromGroupStatusTransitions(
    referralId: string,
    username: Express.User['username'],
  ): Promise<ReferralStatusTransitions> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/remove-from-group/${referralId}`,
      headers: { Accept: 'application/json' },
    })) as ReferralStatusTransitions
  }

  async removeFromGroup(
    username: string,
    referralId: string,
    groupId: string,
    data: RemoveFromGroupRequest,
  ): Promise<RemoveFromGroupResponse> {
    const restClient = await this.createRestClientFromUsername(username)
    return restClient.post({
      path: `/group/${groupId}/remove/${referralId}`,
      headers: { Accept: 'application/json' },
      data,
    })
  }

  async getLocationsForUserRegion(username: Express.User['username']): Promise<CodeDescription[]> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/pdus-for-user-region`,
      headers: { Accept: 'application/json' },
    })) as CodeDescription[]
  }

  async getOfficeLocationsForPdu(username: Express.User['username'], pduCode: string): Promise<CodeDescription[]> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/office-locations-for-pdu/${pduCode}`,
      headers: { Accept: 'application/json' },
    })) as CodeDescription[]
  }

  async getPduMembers(username: Express.User['username']): Promise<UserTeamMember[]> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.get({
      path: `/bff/region/members`,
      headers: { Accept: 'application/json' },
    })) as UserTeamMember[]
  }

  async sessionSchedule(
    username: Express.User['username'],
    data: SessionScheduleRequest,
  ): Promise<SessionScheduleResponse> {
    const restClient = await this.createRestClientFromUsername(username)
    return (await restClient.post({
      path: `/group/schedule`,
      headers: { Accept: 'application/json' },
      data,
    })) as ProgrammeGroupEntity
  }

  async getSessionTemplates(username: ExpressUsername, groupId: string, moduleId: string): Promise<SessionSchedule[]> {
    const restClient = await this.createRestClientFromUsername(username)
    const response = (await restClient.get({
      path: `/bff/group/${groupId}/module/${moduleId}/schedule-session-type`,
      headers: { Accept: 'application/json' },
    })) as SessionSchedule
    return response.sessionTemplates
  }

  async getSessionAttendanceTemplates(
    username: ExpressUsername,
    groupId: string,
    moduleId: string,
  ): Promise<SessionAttendance[]> {
    const restClient = await this.createRestClientFromUsername(username)
    const response = (await restClient.get({
      path: `/bff/group/${groupId}/module/${moduleId}/schedule-session-type`,
      headers: { Accept: 'application/json' },
    })) as SessionAttendance
    return response.sessionTemplates
  }
}
